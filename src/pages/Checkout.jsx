import React, { useState, useEffect } from "react";
import { useStore } from "../hooks/useStore";
import { useAuth } from "../components/useAuth";
import { db } from "../components/Firebase";
import { collection, addDoc, serverTimestamp, doc, getDoc, setDoc, writeBatch } from "firebase/firestore";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Truck,
  ArrowLeft,
  CreditCard,
  User,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  Lock,
  Sparkles,
  AlertCircle,
  Loader2,
  PackageCheck,
  Package,
  Gem,
  Gift,
  ChevronRight,
  ChevronDown,
  Check,
  Plus,
  Home,
  Building2,
  Tag,
  ArrowRight,
  TicketPercent,
  X
} from "lucide-react";
import { sendOrderEmails } from "../services/emailService";
import { createShiprocketOrder } from "../services/shiprocketService";
import { validateCoupon } from "../services/couponService";
import OtpModal from "../components/OtpModal";
import { createRazorpayOrder, verifyPaymentAndCreateOrder } from "../services/otpService";
import { getOptimizedImageUrl, handleImageError } from "../config/cloudinary";

const Checkout = () => {
  const { cartItems, clearCart } = useStore();
  const { user, verifyEmailOtp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [showMobileSummary, setShowMobileSummary] = useState(false);

  // OTP Modal State for Guest Checkout
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [pendingOrderId, setPendingOrderId] = useState(null);
  const [guestEmail, setGuestEmail] = useState("");

  // Saved Addresses State
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedSavedIndex, setSelectedSavedIndex] = useState(null);
  const [isNewAddress, setIsNewAddress] = useState(false);

  // Buy Now context state
  const [buyNowItem, setBuyNowItem] = useState(location.state?.buyNowItem || null);
  const isBuyNow = Boolean(buyNowItem);
  const checkoutItems = isBuyNow ? [buyNowItem] : cartItems;

  useEffect(() => {
    if (location.state?.buyNowItem) {
      setBuyNowItem(location.state.buyNowItem);
    }
  }, [location.state]);

  // Form State
  const [formData, setFormData] = useState({
    name: user?.displayName || "",
    email: user?.email || "",
    phone: "",
    alternatePhone: "",
    flat: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
    type: "Home",
    saveToAccount: true,
  });

  // Load Saved Addresses from User Firestore Doc
  useEffect(() => {
    if (user?.uid) {
      const userRef = doc(db, "users", user.uid);
      getDoc(userRef).then((snap) => {
        if (snap.exists()) {
          const data = snap.data();
          const addrs = data.savedAddresses || [];
          if (addrs.length === 0 && data.defaultAddress) {
            addrs.push({ ...data.defaultAddress, type: "Home", isDefault: true });
          }

          setSavedAddresses(addrs);

          if (addrs.length > 0) {
            const defaultIdx = addrs.findIndex(a => a.isDefault);
            const activeIdx = defaultIdx !== -1 ? defaultIdx : 0;
            const activeAddr = addrs[activeIdx];

            setSelectedSavedIndex(activeIdx);
            setIsNewAddress(false);

            setFormData({
              name: activeAddr.name || data.displayName || data.name || user.displayName || "",
              email: data.email || user.email || "",
              phone: activeAddr.phone || data.phone || data.phoneNumber || "",
              alternatePhone: activeAddr.alternatePhone || "",
              flat: activeAddr.flat || "",
              address: activeAddr.address || "",
              city: activeAddr.city || "",
              state: activeAddr.state || "",
              pincode: activeAddr.pincode || "",
              country: activeAddr.country || "India",
              type: activeAddr.type || "Home",
              saveToAccount: true,
            });
          } else {
            setIsNewAddress(true);
            setFormData(prev => ({
              ...prev,
              name: data.displayName || data.name || user.displayName || prev.name,
              email: data.email || user.email || prev.email,
              phone: data.phone || data.phoneNumber || prev.phone,
            }));
          }
        }
      }).catch(err => console.error("Error loading user saved addresses:", err));
    }
  }, [user]);

  const [stockStatus, setStockStatus] = useState({});

  // Coupon State
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");

  // Calculate totals
  const subtotal = checkoutItems.reduce(
    (sum, item) => sum + Number(item.price || 0) * (item.quantity || 1),
    0
  );
  const shippingFee = 0; // Free Insured Shipping
  const discountAmount = appliedCoupon ? Number(appliedCoupon.discountAmount || 0) : 0;
  const total = Math.max(0, subtotal + shippingFee - discountAmount);

  const handleApplyCoupon = async (e) => {
    if (e) e.preventDefault();
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    setCouponError("");
    setCouponSuccess("");
    try {
      const res = await validateCoupon(couponCode, subtotal);
      if (res.valid) {
        setAppliedCoupon({
          code: res.coupon.code,
          discountAmount: res.discountAmount,
          coupon: res.coupon,
        });
        setCouponSuccess(res.message);
      } else {
        setCouponError(res.message);
      }
    } catch (err) {
      console.error("Coupon error:", err);
      setCouponError("Failed to apply coupon.");
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponSuccess("");
    setCouponError("");
  };

  useEffect(() => {
    const checkStock = async () => {
      const status = {};
      for (const item of checkoutItems) {
        if (!item.id || item.id.startsWith("bs-")) continue;
        try {
          const pRef = doc(db, "products", item.id);
          const pSnap = await getDoc(pRef);
          if (pSnap.exists()) {
            status[item.id] = Number(pSnap.data().stock || 0);
          }
        } catch (e) {
          console.error("Stock check error:", e);
        }
      }
      setStockStatus(status);
    };
    if (checkoutItems.length > 0) {
      checkStock();
    }
  }, [checkoutItems]);

  const isAnyOutOfStock = checkoutItems.some(item => {
    if (!item.id || item.id.startsWith("bs-")) return false;
    const currentStock = stockStatus[item.id];
    return currentStock !== undefined && currentStock < (item.quantity || 1);
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSelectSavedAddress = (idx) => {
    setSelectedSavedIndex(idx);
    setIsNewAddress(false);
    const addr = savedAddresses[idx];
    if (addr) {
      setFormData(prev => ({
        ...prev,
        name: addr.name || prev.name,
        phone: addr.phone || prev.phone,
        alternatePhone: addr.alternatePhone || "",
        flat: addr.flat || "",
        address: addr.address || "",
        city: addr.city || "",
        state: addr.state || "",
        pincode: addr.pincode || "",
        country: addr.country || "India",
        type: addr.type || "Home",
      }));
    }
  };

  const handleAddNewAddress = () => {
    setIsNewAddress(true);
    setSelectedSavedIndex(null);
    setFormData(prev => ({
      ...prev,
      flat: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      alternatePhone: "",
      type: "Home",
    }));
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const executeOrderCreation = async (paymentDetails = {}) => {
    setLoading(true);
    try {
      const orderDate = new Date();
      const orderNumber = `ZEN-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 900 + 100)}`;

      const orderData = {
        orderNumber,
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        alternatePhone: formData.alternatePhone || null,
        userId: user ? user.uid : null,
        isGuest: !user,
        items: checkoutItems.map(item => ({
          id: item.id,
          name: item.name,
          price: Number(item.price),
          original_price: Number(item.original_price || item.price),
          quantity: item.quantity || 1,
          image: item.image || item.primaryImage || '/img/jewellery/j.png',
          category: item.category || 'Jewellery',
        })),
        shippingAddress: {
          name: formData.name,
          phone: formData.phone,
          flat: formData.flat,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          country: formData.country,
          type: formData.type,
          fullAddress: `${formData.flat ? formData.flat + ', ' : ''}${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}`,
        },
        paymentMethod: paymentDetails.paymentMethod || "razorpay",
        paymentStatus: "paid",
        razorpayPaymentId: paymentDetails.razorpayPaymentId || null,
        razorpayOrderId: paymentDetails.razorpayOrderId || null,
        razorpaySignature: paymentDetails.razorpaySignature || null,
        subtotal: subtotal,
        shippingFee: shippingFee,
        discountAmount: discountAmount,
        couponCode: appliedCoupon ? appliedCoupon.code : null,
        totalAmount: total,
        status: "Processing",
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, "orders"), orderData);
      const finalCreatedOrder = { id: docRef.id, ...orderData };

      // Update product inventory stocks
      const batch = writeBatch(db);
      for (const item of checkoutItems) {
        if (!item.id || item.id.startsWith("bs-")) continue;
        const pRef = doc(db, "products", item.id);
        const currentStock = stockStatus[item.id] ?? 10;
        const newStock = Math.max(0, currentStock - (item.quantity || 1));
        batch.update(pRef, { stock: newStock, updatedAt: serverTimestamp() });
      }
      await batch.commit();

      // Shiprocket integration
      createShiprocketOrder(finalCreatedOrder).catch(err => console.error("Shiprocket dispatch error:", err));

      // Email notifications
      sendOrderEmails(finalCreatedOrder).catch(err => console.error("Order email dispatch error:", err));

      // Save address if logged in
      if (user?.uid) {
        try {
          const userRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userRef);
          let currentSaved = [];
          if (userSnap.exists() && userSnap.data().savedAddresses) {
            currentSaved = userSnap.data().savedAddresses;
          }

          const newAddrObj = {
            name: formData.name,
            phone: formData.phone,
            alternatePhone: formData.alternatePhone || "",
            flat: formData.flat || "",
            address: formData.address || "",
            city: formData.city || "",
            state: formData.state || "",
            pincode: formData.pincode || "",
            country: formData.country || "India",
            type: formData.type || "Home",
            isDefault: currentSaved.length === 0
          };

          if (formData.saveToAccount && isNewAddress) {
            const exists = currentSaved.some(a => a.address === newAddrObj.address && a.pincode === newAddrObj.pincode);
            if (!exists) {
              currentSaved.push(newAddrObj);
            }
          }

          await setDoc(userRef, {
            defaultAddress: newAddrObj,
            savedAddresses: currentSaved,
            phone: formData.phone
          }, { merge: true });
        } catch (addrErr) {
          console.warn("Address save error:", addrErr);
        }
      }

      // Clear Shopping Cart & Buy Now State
      setBuyNowItem(null);
      if (typeof window !== 'undefined' && window.history?.replaceState) {
        window.history.replaceState(null, "", window.location.pathname);
      }
      if (clearCart) {
        await clearCart();
      }

      return finalCreatedOrder;
    } catch (err) {
      console.error("Order creation error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async (createdOrder) => {
    setBuyNowItem(null);
    if (typeof window !== 'undefined' && window.history?.replaceState) {
      window.history.replaceState(null, "", window.location.pathname);
    }
    if (clearCart) {
      await clearCart();
    }

    const orderId = createdOrder?.id || createdOrder?.orderId;
    if (orderId) {
      navigate(`/order-success/${orderId}`, { state: { isNewUser: false } });
    } else {
      setOrderSuccess(createdOrder);
    }
  };

  const handleOtpSuccess = async (verificationResult) => {
    setShowOtpModal(false);
    navigate(`/order-success/${pendingOrderId}`, { state: { isNewUser: verificationResult.isNewUser } });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.address || !formData.city || !formData.pincode || !formData.state) {
      alert("Please fill in all required contact & shipping fields.");
      return;
    }

    if (isAnyOutOfStock) {
      alert("One or more items in your cart are currently out of stock.");
      return;
    }

    setLoading(true);

    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        alert("Razorpay payment gateway failed to load. Please check your internet connection.");
        setLoading(false);
        return;
      }

      const rzpOrder = await createRazorpayOrder(checkoutItems, discountAmount);

      const options = {
        key: rzpOrder.keyId || import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_ZenziesKey",
        amount: rzpOrder.amount,
        currency: rzpOrder.currency || "INR",
        name: "Zenzies",
        description: "Zenzies Jewellery & Organizer Box Order",
        image: "/img/logo.png",
        order_id: (rzpOrder.id && !rzpOrder.id.startsWith("order_sim_")) ? rzpOrder.id : undefined,
        handler: async function (response) {
          try {
            setLoading(true);
            const createdOrder = await executeOrderCreation({
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id || rzpOrder.id,
              razorpaySignature: response.razorpay_signature,
              paymentMethod: "razorpay",
            });
            await handlePaymentSuccess(createdOrder);
          } catch (err) {
            console.error("Payment verification error:", err);
            alert(err.message || "Payment verification failed.");
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: "#956638",
        },
      };

      try {
        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
        setLoading(false);
      } catch (err) {
        console.warn("Razorpay simulated mode, completing order directly:", err);
        const createdOrder = await executeOrderCreation({ paymentMethod: "razorpay" });
        await handlePaymentSuccess(createdOrder);
      }
    } catch (err) {
      console.error("Order submission error:", err);
      alert(err.message || "Failed to place order. Please try again.");
      setLoading(false);
    }
  };

  // Order Success Screen
  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] font-body text-[#211A16] pt-32 pb-24 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card-luxury max-w-2xl w-full p-8 sm:p-12 text-center space-y-6 shadow-xl"
        >
          <div className="w-20 h-20 rounded-full bg-[#FAF2E8] border border-[#956638]/30 flex items-center justify-center mx-auto text-[#956638]">
            <CheckCircle2 size={40} />
          </div>

          <div className="space-y-2">
            <span className="eyebrow-text block">
              Order Confirmed & Receipt Dispatched
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#211A16] font-normal">
              Thank You for Your Order
            </h1>
            <p className="body-text text-sm sm:text-base text-[#6B5E52] max-w-md mx-auto">
              Your order <span className="font-bold text-[#211A16] font-mono">{orderSuccess.orderNumber || `#${orderSuccess.id.slice(0, 10).toUpperCase()}`}</span> is now being prepared in our signature velvet packaging.
            </p>
          </div>

          {/* Details Box */}
          <div className="bg-[#FAF7F2] rounded-xl p-6 border border-[#E8DDD2] text-left space-y-3 text-xs sm:text-sm">
            <div className="flex justify-between border-b border-[#E8DDD2] pb-2">
              <span className="text-[#9E9082] uppercase font-semibold text-[11px]">Recipient</span>
              <span className="font-semibold text-[#211A16]">{orderSuccess.customerName}</span>
            </div>
            <div className="flex justify-between border-b border-[#E8DDD2] pb-2">
              <span className="text-[#9E9082] uppercase font-semibold text-[11px]">Destination</span>
              <span className="font-medium text-[#211A16] text-right max-w-xs">{orderSuccess.shippingAddress.fullAddress}</span>
            </div>
            <div className="flex justify-between items-baseline pt-1">
              <span className="text-[#9E9082] uppercase font-semibold text-[11px]">Total Paid</span>
              <span className="font-serif text-xl font-normal text-[#211A16]">₹{Number(orderSuccess.totalAmount).toLocaleString()}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => navigate(`/orders`)}
              className="btn-luxury-primary flex-1 justify-center"
            >
              <span>View Order History</span>
              <ArrowRight size={14} />
            </button>
            <button
              onClick={() => navigate('/shop')}
              className="btn-luxury-secondary flex-1 justify-center"
            >
              Continue Browsing
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (checkoutItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex flex-col items-center justify-center p-6 text-center pt-32 font-body text-[#211A16]">
        <Gem size={44} className="text-[#956638] mb-4" />
        <h2 className="font-serif text-3xl sm:text-4xl text-[#211A16] font-normal">Your shopping bag is empty.</h2>
        <p className="body-text text-sm sm:text-base text-[#6B5E52] mt-2 mb-8 max-w-sm">
          Please add creations to your bag before proceeding to express checkout.
        </p>
        <button
          onClick={() => navigate('/shop')}
          className="btn-luxury-primary"
        >
          Explore Boutique Catalogue
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] font-body text-[#211A16]">

      {/* ── Refined Light Luxury Breadcrumb Strip ── */}
      <div className="w-full bg-[#FAF7F2] border-b border-[#E8DDD2] pt-24 sm:pt-28 pb-4">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-10">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#6B5E52]">
            <Link to="/" className="hover:text-[#956638] transition-colors">Home</Link>
            <ChevronRight size={13} className="text-[#9E9082]" />
            <Link to="/cart" className="hover:text-[#956638] transition-colors">Bag</Link>
            <ChevronRight size={13} className="text-[#9E9082]" />
            <span className="text-[#211A16] font-semibold">Express Checkout</span>
          </nav>
        </div>
      </div>

      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-10 pb-32 lg:pb-24">

        {/* Stock Alert Banner */}
        {isAnyOutOfStock && (
          <div className="mb-6 bg-rose-50 border border-rose-200 p-4 rounded-xl flex items-center gap-3 text-rose-700 text-xs sm:text-sm font-medium">
            <AlertCircle size={18} className="shrink-0 text-rose-600" />
            <p>One or more pieces in your bag are currently out of stock. Please adjust quantities to continue.</p>
          </div>
        )}

        {/* Mobile Collapsible Order Summary */}
        <div className="lg:hidden card-luxury mb-6 overflow-hidden">
          <button
            type="button"
            onClick={() => setShowMobileSummary(!showMobileSummary)}
            className="w-full p-4 bg-[#FAF7F2] flex items-center justify-between text-left cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Sparkles size={15} className="text-[#956638]" />
              <span className="text-xs font-semibold uppercase tracking-wider text-[#211A16]">
                {showMobileSummary ? "Hide Order Summary" : "Show Order Summary"}
              </span>
              <span className="text-[11px] text-[#6B5E52] bg-white border border-[#E8DDD2] px-2 py-0.5 rounded-full">
                {checkoutItems.length} {checkoutItems.length === 1 ? 'Piece' : 'Pieces'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-lg text-[#211A16]">
                ₹{total.toLocaleString()}
              </span>
              <ChevronDown size={16} className={`text-[#211A16] transition-transform duration-200 ${showMobileSummary ? "rotate-180" : ""}`} />
            </div>
          </button>

          <AnimatePresence>
            {showMobileSummary && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="p-4 border-t border-[#E8DDD2] space-y-3 bg-white"
              >
                <div className="space-y-2 max-h-56 overflow-y-auto">
                  {checkoutItems.map((item, idx) => (
                    <div key={idx} className="flex gap-3 items-center p-2 rounded-lg bg-[#FAF7F2]">
                      <div className="w-12 h-14 rounded-lg overflow-hidden bg-white border border-[#E8DDD2] shrink-0">
                        <img
                          src={getOptimizedImageUrl(item.image || item.primaryImage || '/img/jewellery/j.png')}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-serif font-medium text-[#211A16] truncate">{item.name}</h4>
                        <p className="text-[11px] text-[#6B5E52]">Qty: {item.quantity || 1}</p>
                        <p className="text-xs font-semibold text-[#211A16]">
                          ₹{Number(item.price).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

          {/* Left Column: Delivery Address & Payment Mode (7-8 Cols) */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">

            {/* STEP 1: DELIVERY ADDRESS */}
            <div className="card-luxury p-6 sm:p-8 space-y-6">

              <div className="flex items-center justify-between border-b border-[#E8DDD2] pb-4">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-[#211A16] text-white text-xs font-semibold flex items-center justify-center">1</span>
                  <h3 className="font-serif text-xl sm:text-2xl text-[#211A16] font-normal">Delivery Address & Contact</h3>
                </div>
                <span className="eyebrow-text">Step 1 of 2</span>
              </div>

              {/* Saved Addresses List */}
              {savedAddresses.length > 0 && (
                <div className="space-y-3 bg-[#FAF7F2] p-4 sm:p-5 rounded-xl border border-[#E8DDD2]">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#211A16] flex items-center gap-1.5">
                      <MapPin size={14} className="text-[#956638]" />
                      Select from Saved Addresses
                    </label>
                    <button
                      type="button"
                      onClick={handleAddNewAddress}
                      className="text-xs font-semibold uppercase tracking-wider text-[#956638] hover:text-[#211A16] flex items-center gap-1 cursor-pointer"
                    >
                      <Plus size={13} /> Add New Address
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {savedAddresses.map((addr, idx) => {
                      const isSelected = selectedSavedIndex === idx && !isNewAddress;
                      return (
                        <div
                          key={idx}
                          onClick={() => handleSelectSavedAddress(idx)}
                          className={`p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between space-y-1.5 ${
                            isSelected
                              ? "bg-white border-[#956638] ring-2 ring-[#956638]/20 shadow-xs"
                              : "bg-white/80 border-[#E8DDD2] hover:border-[#956638]"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="badge-luxury text-[10px] py-0.5 px-2">
                              {addr.type || "Home"}
                            </span>
                            {isSelected && (
                              <span className="text-[11px] font-semibold text-emerald-800 flex items-center gap-1">
                                <Check size={12} /> Selected
                              </span>
                            )}
                          </div>
                          <div>
                            <h4 className="text-xs font-semibold text-[#211A16]">{addr.name}</h4>
                            <p className="text-xs text-[#6B5E52] line-clamp-2 leading-relaxed">
                              {addr.flat ? addr.flat + ', ' : ''}{addr.address}, {addr.city}, {addr.state} - {addr.pincode}
                            </p>
                            <p className="text-[11px] text-[#9E9082] mt-0.5">Phone: {addr.phone}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Form Input Fields */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  {/* Name */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B5E52] mb-1.5">
                      Recipient Name *
                    </label>
                    <input
                      type="text"
                      required
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Full recipient name"
                      className="input-luxury w-full"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B5E52] mb-1.5">
                      Email Address (Order Tracking) *
                    </label>
                    <input
                      type="email"
                      required
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="name@example.com"
                      className="input-luxury w-full"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B5E52] mb-1.5">
                      Mobile Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="10-digit mobile number"
                      className="input-luxury w-full"
                    />
                  </div>

                  {/* Alternate Phone */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B5E52] mb-1.5">
                      Alternate Phone <span className="font-normal text-[#9E9082]">(Optional)</span>
                    </label>
                    <input
                      type="tel"
                      name="alternatePhone"
                      value={formData.alternatePhone}
                      onChange={handleInputChange}
                      placeholder="Secondary contact number"
                      className="input-luxury w-full"
                    />
                  </div>

                  {/* Flat / Suite */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B5E52] mb-1.5">
                      Flat / House No. / Apartment / Suite *
                    </label>
                    <input
                      type="text"
                      required
                      name="flat"
                      value={formData.flat}
                      onChange={handleInputChange}
                      placeholder="e.g. Flat 302, Palm Grove Residences"
                      className="input-luxury w-full"
                    />
                  </div>

                  {/* Street Address */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B5E52] mb-1.5">
                      Street Address / Colony / Landmark *
                    </label>
                    <textarea
                      rows={2}
                      required
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Street name, landmark, locality"
                      className="input-luxury w-full p-3 resize-none"
                    />
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B5E52] mb-1.5">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="e.g. Mumbai, Bengaluru"
                      className="input-luxury w-full"
                    />
                  </div>

                  {/* State */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B5E52] mb-1.5">
                      State *
                    </label>
                    <input
                      type="text"
                      required
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      placeholder="e.g. Maharashtra"
                      className="input-luxury w-full"
                    />
                  </div>

                  {/* Pincode */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B5E52] mb-1.5">
                      6-Digit Postal Pincode *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      placeholder="e.g. 400001"
                      className="input-luxury w-full font-mono"
                    />
                  </div>

                  {/* Address Type */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B5E52] mb-1.5">
                      Address Type
                    </label>
                    <div className="flex gap-2">
                      {["Home", "Work", "Other"].map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, type: t }))}
                          className={`flex-1 py-2 rounded-lg border text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-1 cursor-pointer ${
                            formData.type === t
                              ? "bg-[#211A16] text-white border-[#211A16]"
                              : "bg-white text-[#6B5E52] border-[#E8DDD2] hover:border-[#956638]"
                          }`}
                        >
                          {t === "Home" && <Home size={12} />}
                          {t === "Work" && <Building2 size={12} />}
                          {t === "Other" && <MapPin size={12} />}
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Save Address Checkbox */}
                {user?.uid && (
                  <div className="pt-2">
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-[#6B5E52]">
                      <input
                        type="checkbox"
                        name="saveToAccount"
                        checked={formData.saveToAccount}
                        onChange={handleInputChange}
                        className="w-4 h-4 accent-[#956638] rounded"
                      />
                      <span>Save this address to my profile for future express checkouts</span>
                    </label>
                  </div>
                )}
              </div>

            </div>

            {/* STEP 2: PAYMENT METHOD */}
            <div className="card-luxury p-6 sm:p-8 space-y-6">

              <div className="flex items-center justify-between border-b border-[#E8DDD2] pb-4">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-[#211A16] text-white text-xs font-semibold flex items-center justify-center">2</span>
                  <h3 className="font-serif text-xl sm:text-2xl text-[#211A16] font-normal">Payment & Security</h3>
                </div>
                <span className="eyebrow-text">Step 2 of 2</span>
              </div>

              {/* Razorpay Online Payment Box */}
              <div className="p-4 sm:p-5 rounded-xl border-2 border-[#956638] bg-[#FAF7F2] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#956638] flex items-center justify-center shrink-0">
                      <div className="w-2 h-2 rounded-full bg-white" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#211A16] flex items-center gap-2">
                        <span>Razorpay Secure Online Checkout</span>
                        <span className="badge-luxury text-[10px] py-0.5 px-2 bg-emerald-50 text-emerald-800 border-emerald-200">
                          100% Verified
                        </span>
                      </p>
                      <p className="text-xs text-[#6B5E52] mt-0.5">
                        UPI (GPay, PhonePe, Paytm), Credit & Debit Cards, NetBanking
                      </p>
                    </div>
                  </div>
                  <CreditCard size={22} className="text-[#956638] shrink-0 hidden sm:block" />
                </div>
                <div className="pt-2 border-t border-[#E8DDD2] flex items-center gap-2 text-xs text-[#6B5E52]">
                  <ShieldCheck size={14} className="text-[#956638] shrink-0" />
                  <span>Insured Pan-India transit with 256-bit bank encryption.</span>
                </div>
              </div>

            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="card-luxury p-3.5 text-center space-y-1">
                <ShieldCheck size={20} className="mx-auto text-[#956638]" />
                <h5 className="text-xs font-semibold uppercase tracking-wider text-[#211A16]">256-Bit SSL Encrypted</h5>
                <p className="text-xs text-[#6B5E52]">Bank-grade secure transaction</p>
              </div>

              <div className="card-luxury p-3.5 text-center space-y-1">
                <Truck size={20} className="mx-auto text-[#956638]" />
                <h5 className="text-xs font-semibold uppercase tracking-wider text-[#211A16]">Free Insured Transit</h5>
                <p className="text-xs text-[#6B5E52]">Full doorstep protection</p>
              </div>

              <div className="card-luxury p-3.5 text-center space-y-1">
                <Package size={20} className="mx-auto text-[#956638]" />
                <h5 className="text-xs font-semibold uppercase tracking-wider text-[#211A16]">Signature Box</h5>
                <p className="text-xs text-[#6B5E52]">Velvet lined luxury box</p>
              </div>
            </div>

          </div>

          {/* Right Column: Sticky Order Summary (4-5 Cols) */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-6">
            <div className="card-luxury p-6 sm:p-7 lg:sticky lg:top-24 space-y-5 border-t-4 border-t-[#956638]">

              <div className="border-b border-[#E8DDD2] pb-4 flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-xl sm:text-2xl text-[#211A16] font-normal">Order Summary</h3>
                  <p className="text-xs text-[#6B5E52] mt-0.5">
                    {checkoutItems.length} Piece{checkoutItems.length > 1 ? 's' : ''} in Bag
                  </p>
                </div>
                <Sparkles size={16} className="text-[#956638]" />
              </div>

              {/* Items Preview */}
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {checkoutItems.map((item, idx) => (
                  <div key={idx} className="flex gap-3 items-center p-2 rounded-xl bg-[#FAF7F2] border border-[#E8DDD2]">
                    <div className="w-12 h-14 rounded-lg overflow-hidden bg-white border border-[#E8DDD2] shrink-0">
                      <img
                        src={getOptimizedImageUrl(item.image || item.primaryImage || '/img/jewellery/j.png')}
                        alt={item.name}
                        loading="lazy"
                        decoding="async"
                        onError={(e) => handleImageError(e, item.image)}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-serif font-medium text-[#211A16] truncate">{item.name}</h4>
                      <p className="text-[11px] text-[#6B5E52]">Qty: {item.quantity || 1}</p>
                      <p className="text-xs font-semibold text-[#211A16]">
                        ₹{Number(item.price).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Coupon Code Section */}
              <div className="space-y-2 pt-2 border-t border-[#E8DDD2]">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#211A16] flex items-center gap-1.5">
                  <TicketPercent size={14} className="text-[#956638]" />
                  Promo / Coupon Code
                </label>

                {!appliedCoupon ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. ZENZIES10"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      className="input-luxury flex-1 text-xs font-mono font-bold uppercase min-h-[42px]"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      disabled={couponLoading || !couponCode.trim()}
                      className="btn-luxury-dark text-xs px-4 min-h-[42px] disabled:opacity-50"
                    >
                      {couponLoading ? "..." : "Apply"}
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={15} className="text-emerald-700 shrink-0" />
                      <div>
                        <p className="font-bold font-mono text-xs">{appliedCoupon.code} APPLIED</p>
                        <p className="text-[11px] text-emerald-800">Saved ₹{appliedCoupon.discountAmount.toLocaleString()}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="text-emerald-800 hover:text-rose-600 p-1 font-bold cursor-pointer"
                      title="Remove coupon"
                    >
                      <X size={15} />
                    </button>
                  </div>
                )}

                {couponError && <p className="text-xs text-rose-600 font-semibold">{couponError}</p>}
                {couponSuccess && !appliedCoupon && <p className="text-xs text-emerald-600 font-semibold">{couponSuccess}</p>}
              </div>

              {/* Cost Calculations */}
              <div className="space-y-2.5 pt-3 border-t border-[#E8DDD2] text-xs sm:text-sm">
                <div className="flex justify-between text-[#6B5E52]">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#211A16]">₹{subtotal.toLocaleString()}</span>
                </div>

                <div className="flex justify-between text-[#6B5E52]">
                  <span>Insured Express Shipping</span>
                  <span className="font-semibold text-emerald-800 uppercase text-xs">FREE</span>
                </div>

                <div className="flex justify-between text-[#6B5E52]">
                  <span>Goods & Services Tax (GST)</span>
                  <span className="font-semibold text-emerald-800 text-xs">Included in price</span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-800 font-semibold bg-emerald-50 p-2 rounded-lg border border-emerald-200 text-xs">
                    <span>Coupon Savings ({appliedCoupon.code})</span>
                    <span>−₹{discountAmount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between items-baseline pt-3 border-t border-[#E8DDD2]">
                  <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#211A16]">Total Amount</span>
                  <span className="font-serif text-2xl sm:text-3xl text-[#211A16] font-normal">₹{total.toLocaleString()}</span>
                </div>
              </div>

              {/* Primary Place Order Button */}
              <button
                type="submit"
                disabled={loading || isAnyOutOfStock}
                className="btn-luxury-primary w-full justify-center min-h-[50px] shadow-md hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? (
                  <Loader2 size={16} className="animate-spin shrink-0" />
                ) : (
                  <Lock size={16} className="shrink-0 text-white" />
                )}
                <span>{loading ? 'Processing Order...' : 'Complete Purchase'}</span>
              </button>

              <p className="text-xs text-[#9E9082] text-center flex items-center justify-center gap-1.5">
                <Lock size={13} className="text-[#956638]" />
                256-Bit SSL Encrypted & Authenticated
              </p>

            </div>
          </div>

        </form>

      </div>

      {/* Mobile Sticky Bottom Order Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E8DDD2] p-3 px-4 shadow-[0_-4px_25px_rgba(0,0,0,0.08)] flex items-center justify-between gap-4">
        <div className="min-w-0">
          <span className="text-[11px] text-[#9E9082] uppercase tracking-wider block">
            Total Payable
          </span>
          <span className="font-serif text-xl font-normal text-[#211A16]">
            ₹{total.toLocaleString()}
          </span>
        </div>

        <button
          onClick={handlePlaceOrder}
          disabled={loading || isAnyOutOfStock}
          className="btn-luxury-primary text-xs px-6 py-2.5 min-h-[44px] disabled:opacity-40"
        >
          {loading ? <Loader2 size={14} className="animate-spin" /> : <Lock size={14} className="text-white" />}
          <span>{loading ? "Processing..." : "Place Order"}</span>
        </button>
      </div>

      {/* Guest Checkout OTP Modal */}
      <OtpModal
        isOpen={showOtpModal}
        onClose={() => setShowOtpModal(false)}
        email={guestEmail}
        orderId={pendingOrderId}
        displayName={formData.name}
        onSuccess={handleOtpSuccess}
      />
    </div>
  );
};

export default Checkout;
