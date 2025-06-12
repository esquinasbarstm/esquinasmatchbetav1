import { db } from "./firebase.js";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

document.querySelector("form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const nome = document.getElementById("nome").value.trim();
  const senha = document.getElementById("senha").value.trim();

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
        const userId = docUser.id;
        localStorage.setItem("userId", userId);

        // Verifica se perfil já está completo
        const perfilDoc = await getDoc(doc(db, "usuarios", userId));
        const perfil = perfilDoc.data();

        if (perfil.instagram && perfil.genero && perfil.interesse && perfil.fotoURL) {
          window.location.href = "matches.html";
        } else {
          window.location.href = "profile.html";
        }

      } else {
        alert("Senha incorreta.");
      }

    } else {
      // Novo usuário
      const novoDoc = await addDoc(collection(db, "usuarios"), {
        nome,
        senha,
        criadoEm: serverTimestamp()
      });

      localStorage.setItem("userId", novoDoc.id);
      alert("Conta criada com sucesso. Complete seu perfil.");
      window.location.href = "profile.html";
    }

  } catch (error) {
    console.error("Erro no login:", error);
    alert("Erro ao fazer login. Tente novamente.");
  }
});
