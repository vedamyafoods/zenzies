import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAD-33D6F3pEm_73vQbqDtpwXmwWwJqobo",
  authDomain: "zenzies-f3971.firebaseapp.com",
  projectId: "zenzies-f3971",
  storageBucket: "zenzies-f3971.firebasestorage.app",
  messagingSenderId: "694511372753",
  appId: "1:694511372753:web:f15ade02c0df7d0d7338f0"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function run() {
  console.log("Seeding global_buttons and updated tokens into site_settings/section_designs...");
  await setDoc(doc(db, "site_settings", "section_designs"), {
    global_buttons: {
      btnGradientFrom: '#A26B38',
      btnGradientTo: '#7B4F26',
      btnGradientAngle: '135deg',
      btnGradient: 'linear-gradient(135deg, #A26B38 0%, #7B4F26 100%)',
      btnTextColor: '#FFFFFF',
      btnBorderRadius: '6px',
    },
    category_grid: {
      backgroundColor: '#FAF7F2',
      accentColor: '#8C6239',
    }
  }, { merge: true });

  console.log("Successfully seeded global_buttons and updated category_grid!");
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
