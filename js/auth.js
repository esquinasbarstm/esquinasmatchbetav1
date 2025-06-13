// auth.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDqyuCh4pOphH_Izal6hoytjy3CZG5XkT8",
  authDomain: "esquinas-match.firebaseapp.com",
  projectId: "esquinas-match",
  storageBucket: "esquinas-match.appspot.com",
  messagingSenderId: "1047206691859",
  appId: "1:1047206691859:web:b3f4b94c00098843762be6"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nome = document.getElementById("nome").value.trim();
  const senha = document.getElementById("senha").value.trim();

  if (!nome || !senha) {
    alert("Preencha todos os campos.");
    return;
  }

  const userId = nome.toLowerCase().replace(/\s+/g, "_");
  const userRef = doc(db, "usuarios", userId);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    const userData = userSnap.data();

    if (userData.senha === senha) {
      localStorage.setItem("userId", userId);
      localStorage.setItem("nome", nome);
      alert("Login realizado com sucesso!");
      window.location.href = "explorar.html";
    } else {
      alert("Senha incorreta.");
    }
  } else {
    // Se não existe, cria novo usuário com senha (perfil será completado depois)
    await setDoc(userRef, {
      nome,
      senha
    });
    localStorage.setItem("userId", userId);
    localStorage.setItem("nome", nome);
    alert("Conta criada com sucesso! Complete seu perfil.");
    window.location.href = "profile.html";
  }
});
