// Importa Firestore e Storage do Firebase
import { db, storage } from "./firebase.js";
import {
  doc,
  updateDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import {
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-storage.js";

// Escuta o envio do formulário de perfil
document.getElementById("profileForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const userId = localStorage.getItem("userId");
  if (!userId) {
    alert("Usuário não autenticado.");
    return;
  }

  const file = document.getElementById("foto").files[0];
  const instagram = document.getElementById("instagram").value.trim();
  const genero = document.getElementById("genero").value;
  const interesse = document.getElementById("interesse").value;

  if (!file || !instagram || !genero || !interesse) {
    alert("Preencha todos os campos.");
    return;
  }

  try {
    const storageRef = ref(storage, `fotosPerfil/${userId}`);
    await uploadBytes(storageRef, file);
    const fotoUrl = await getDownloadURL(storageRef); // Correção aqui

    const userRef = doc(db, "usuarios", userId);
    await updateDoc(userRef, {
      instagram,
      genero,
      interesse,
      fotoUrl, // Correção aqui também
      atualizadoEm: serverTimestamp()
    });

    window.location.href = "explorar.html"; // opcionalmente redirecionar para a tela de perfis
  } catch (err) {
    console.error("Erro ao salvar perfil:", err);
    alert("Erro ao salvar perfil. Tente novamente.");
  }
});
