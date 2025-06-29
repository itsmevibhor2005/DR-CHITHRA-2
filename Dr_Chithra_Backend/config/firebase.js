import admin from "firebase-admin";
import "dotenv/config"; // ✅ Load environment variables from .env file

// Initialize Admin SDK only once
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      type: process.env.TYPE,
      project_id: process.env.PROJECT_ID,
      private_key_id: process.env.PRIVATE_KEY_ID,
      private_key: process.env.PRIVATE_KEY.replace(/\\n/g, "\n"), // ✅ replace escaped newlines
      client_email: process.env.CLIENT_EMAIL,
      client_id: process.env.CLIENT_ID,
      auth_uri: process.env.AUTH_URI,
      token_uri: process.env.TOKEN_URI,
      auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL,
      client_x509_cert_url: process.env.CLIENT_X509_CERT_URL,
      uuniverse_domain: process.env.UNIVERSE_DOMAIN || "googleapis.com", // ✅ default to googleapis.com if not set
    }),
    storageBucket: process.env.STORAGE_BUCKET, // ✅ ensure correct bucket name from Firebase Console
  });
}

// Firestore and Storage instances
export const db = admin.firestore();
export const storage = admin.storage().bucket(); // ✅ Export bucket for file uploads
export default admin;
