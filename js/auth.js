import { db } from "./firebase.js";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  setDoc,
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
        localStorage.setItem("userId", docUser.id);
        const perfil = await getDoc(doc(db, "usuarios", docUser.id));
        const { instagram, genero, interesse, fotoURL } = perfil.data();

        if (instagram && genero && interesse && fotoURL) {
          window.location.href = "matches.html";
        } else {
          window.location.href = "profile.html";
        }
      } else {
        alert("Senha incorreta.");
      }
    } else {
      const docRef = doc(collection(db, "usuarios"));
      await setDoc(docRef, {
        nome,
        senha,
        criadoEm: serverTimestamp(),
      });
      localStorage.setItem("userId", docRef.id);
      window.location.href = "profile.html";
    }
  } catch (err) {
    console.error("Erro no login:", err);
    alert("Erro ao fazer login. Tente novamente.");
  }
});
