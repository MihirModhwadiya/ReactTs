import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCrRwgQVPe6rkJqh6QoZi2NSJlziEmz0Vk",
  authDomain: "chatingapp-c8cdf.firebaseapp.com",
  databaseURL: "https://chatingapp-c8cdf-default-rtdb.firebaseio.com",
  projectId: "chatingapp-c8cdf",
  storageBucket: "chatingapp-c8cdf.appspot.com",
  messagingSenderId: "623369120835",
  appId: "1:623369120835:web:7e28ae3da69fb5aa1af8f6",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);
