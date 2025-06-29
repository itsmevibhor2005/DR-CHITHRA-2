import { initializeApp } from "firebase/app";
import { getAuth, signInWithCustomToken } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCHo7QxXOgXCJTFOzLyf3rVQwuQsCRNkdA",
  authDomain: "dr-chithra-2.firebaseapp.com",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

if (!app) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
}

// 🔹 Function to get ID token from custom token
export async function getIdTokenFromCustomToken(customToken) {
  try {
    const userCredential = await signInWithCustomToken(auth, customToken);
    const idToken = await userCredential.user.getIdToken();
    return idToken;
  } catch (error) {
    console.error("❌ Firebase Custom Token Sign-In Error:", error);
    throw error;
  }
}