// auth.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Configuração do Firebase
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
        // Salva ID e nome
        localStorage.setItem("userId", userId);
        localStorage.setItem("nome", nome);
        localStorage.setItem("senha", senha); // opcional, para uso futuro

        // Salva dados do perfil no localStorage (caso já existam)
        if (userData.instagram) localStorage.setItem("instagram", userData.instagram);
        if (userData.genero) localStorage.setItem("genero", userData.genero);
        if (userData.buscaGenero || userData.interesse)
          localStorage.setItem("buscaGenero", userData.buscaGenero || userData.interesse);
        if (userData.fotoURL) localStorage.setItem("fotoURL", userData.fotoURL);

        // Verifica se perfil está completo
        const perfilCompleto =
          userData.instagram &&
          userData.genero &&
          (userData.buscaGenero || userData.interesse) &&
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
      // Novo usuário
      await setDoc(userRef, {
        nome,
        senha
      });

      localStorage.setItem("userId", userId);
      localStorage.setItem("nome", nome);
      localStorage.setItem("senha", senha);

      alert("Conta criada com sucesso! Complete seu perfil.");
      window.location.href = "profile.html";
    }

  } catch (error) {
    console.error("Erro no login:", error);
    alert("Erro ao fazer login. Tente novamente.");
  }
});
