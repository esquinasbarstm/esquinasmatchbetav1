// auth.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Config Firebase
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

// Login
const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nomeInput = document.getElementById("nome");
  const senhaInput = document.getElementById("senha");

  if (!nomeInput || !senhaInput) {
    alert("Formulário não encontrado.");
    return;
  }

  const nome = nomeInput.value.trim();
  const senha = senhaInput.value.trim();

  if (!nome || !senha) {
    alert("Preencha todos os campos.");
    return;
  }

  const userId = nome.toLowerCase().replace(/\s+/g, "_");
  const userRef = doc(db, "usuarios", userId);

  try {
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data();

      if (userData?.senha === senha) {
        localStorage.setItem("userId", userId);
        localStorage.setItem("nome", nome);

        // ✅ Verifica se perfil está completo
        const perfilCompleto =
          userData.instagram &&
          userData.genero &&
          userData.interesse &&
          userData.fotoURL;

        if (perfilCompleto) {
          window.location.href = "explorar.html";
        } else {
          window.location.href = "profile.html";
        }

      } else {
        alert("Senha incorreta.");
      }

    } else {
      // Cria novo usuário com apenas nome e senha
      await setDoc(userRef, {
        nome,
        senha
      });

      localStorage.setItem("userId", userId);
      localStorage.setItem("nome", nome);
      alert("Conta criada com sucesso! Complete seu perfil.");
      window.location.href = "profile.html";
    }

  } catch (error) {
    console.error("Erro no login:", error);
    alert("Erro ao fazer login. Tente novamente.");
  }
});
