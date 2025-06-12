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

  // Busca o ID do usuário salvo no login
  const userId = localStorage.getItem("userId");
  if (!userId) {
    alert("Usuário não autenticado.");
    return;
  }

  // Captura os dados do formulário
  const file = document.getElementById("foto").files[0];
  const instagram = document.getElementById("instagram").value;
  const genero = document.getElementById("genero").value;
  const interesse = document.getElementById("interesse").value;

  // Validação simples
  if (!file || !instagram || !genero || !interesse) {
    alert("Preencha todos os campos.");
    return;
  }

  try {
    let fotoURL = "";

    // 🔼 Faz upload da imagem para o Firebase Storage
    const storageRef = ref(storage, `fotosPerfil/${userId}`);
    await uploadBytes(storageRef, file);
    fotoURL = await getDownloadURL(storageRef);

    // 📝 Atualiza o documento do usuário no Firestore
    const userRef = doc(db, "usuarios", userId);
    await updateDoc(userRef, {
      instagram,
      genero,
      interesse,
      fotoURL,
      atualizadoEm: serverTimestamp()
    });

    // ✅ Redireciona para a página principal após salvar
    window.location.href = "matches.html";
  } catch (err) {
    console.error("Erro ao salvar perfil:", err);
    alert("Erro ao salvar perfil. Tente novamente.");
  }
});
