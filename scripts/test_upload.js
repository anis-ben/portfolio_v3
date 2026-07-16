const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, 'utf8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const parts = trimmed.split('=');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const val = parts.slice(1).join('=').trim().replace(/^['"]|['"]$/g, '');
      process.env[key] = val;
    }
  }
}

const { initializeApp } = require('firebase/app');
const { getStorage, ref, uploadBytes, getDownloadURL } = require('firebase/storage');

const baseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const bucketsToTest = [
  'portfolio-v3-7d461.appspot.com',
  'portfolio-v3-7d461.firebasestorage.app',
  'portfolio-v3-7d461'
];

async function run() {
  const imagePath = path.join(__dirname, '..', 'test img', '1777455292105_0.png');
  const data = fs.readFileSync(imagePath);

  for (const bucket of bucketsToTest) {
    console.log(`\n========================================`);
    console.log(`Testing bucket: ${bucket}`);
    const firebaseConfig = { ...baseConfig, storageBucket: bucket };
    
    try {
      const app = initializeApp(firebaseConfig, bucket); // Use unique app names
      const storage = getStorage(app);
      const storageRef = ref(storage, 'test/test_upload.png');
      
      console.log("Uploading...");
      const snapshot = await uploadBytes(storageRef, data, { contentType: 'image/png' });
      console.log(`SUCCESS for ${bucket}!`);
      const url = await getDownloadURL(snapshot.ref);
      console.log(`URL: ${url}`);
    } catch (error) {
      console.log(`FAILED for ${bucket}. Status: ${error.status_ || error.status}, Code: ${error.code}`);
      if (error.customData && error.customData.serverResponse) {
        console.log("Server Response:", error.customData.serverResponse);
      } else {
        console.log("Full error message:", error.message);
      }
    }
  }
}

run();
