// Importações do Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

// 🔧 Configuração do seu projeto Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDqyuCh4pOphH_Izal6hoytjy3CZG5XkT8",
  authDomain: "esquinas-match.firebaseapp.com",
  projectId: "esquinas-match",
  storageBucket: "esquinas-match.firebasestorage.app
",
  messagingSenderId: "1047206691859",
  appId: "1:1047206691859:web:b3f4b94c00098843762be6"
};

// 🚀 Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// 🔗 Exporta Firestore e Storage para uso nos outros scripts
export const db = getFirestore(app);
export const storage = getStorage(app);
