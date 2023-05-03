// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"
import {v4} from 'uuid'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBlgSRccgyLnYDrE7p2_cZKYaT3q5mlnPU",
  authDomain: "pet-shop-7fda9.firebaseapp.com",
  projectId: "pet-shop-7fda9",
  storageBucket: "pet-shop-7fda9.appspot.com",
  messagingSenderId: "41056743080",
  appId: "1:41056743080:web:5f9ba6765bab93451bdc9d",
  measurementId: "G-BCHR0HT95K"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);

export async function uploadFile(file) {
  const storageRef = ref(storage, v4())
  const data = await uploadBytes(storageRef, file)
  const url = await getDownloadURL(storageRef).then(url => url)
  return [data, url];
}

//const analytics = getAnalytics(app);