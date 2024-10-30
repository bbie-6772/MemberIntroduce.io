// common.js

//---- Firebase 설정
// Firebase SDK 라이브러리 가져오기
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js';

import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    setDoc,
    doc,
} from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js';
import {
    getStorage,
    ref,
    uploadBytes,
    getDownloadURL,
} from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-storage.js';

// Firebase 구성 정보 설정
const firebaseConfig = {
    apiKey: 'AIzaSyCGqR4KmttjxTiDXOgnAlq_zK85FfceU_4',
    authDomain: 'sparta-1aa54.firebaseapp.com',
    projectId: 'sparta-1aa54',
    storageBucket: 'sparta-1aa54.appspot.com',
    messagingSenderId: '210610766907',
    appId: '1:210610766907:web:f3553a0bb7e166be9c081e',
    measurementId: 'G-8ETLMBCMF2',
};

// Firebase 인스턴스 초기화
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);

export {
    collection,
    addDoc,
    getDocs,
    setDoc,
    doc,
    ref,
    uploadBytes,
    getDownloadURL,
};
