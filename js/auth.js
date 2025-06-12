import { db } from './firebase.js';
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp
} from "firebase/firestore";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nome = document.querySelector("#nome").value.trim();
    const senha = document.querySelector("#senha").value.trim();

    if (!nome || !senha) {
      alert("Preencha nome e senha.");
      return;
    }

    try {
      const q = query(collection(db, "usuarios"), where("nome", "==", nome));
      const snap = await getDocs(q);

      if (!snap.empty) {
        const docUser = snap.docs[0];
        const dados = docUser.data();

        if (dados.senha === senha) {
          localStorage.setItem("userId", docUser.id);
          window.location.href = "profile.html";
        } else {
          alert("Senha incorreta.");
        }

      } else {
        // Cria novo usuário
        const docRef = await addDoc(collection(db, "usuarios"), {
          nome,
          senha,
          criadoEm: serverTimestamp()
        });

        localStorage.setItem("userId", docRef.id);
        window.location.href = "profile.html";
      }

    } catch (error) {
      console.error("Erro no login:", error);
      alert("Erro ao fazer login. Tente novamente.");
    }
  });
});
