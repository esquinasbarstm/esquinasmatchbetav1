import { db, storage } from './firebase.js';
import {
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";
import {
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-storage.js";

// Elementos do formulário
const form = document.getElementById("profileForm");
const fotoInput = document.getElementById("foto");
const preview = document.getElementById("preview");

// Mostrar preview da imagem
fotoInput.addEventListener("change", () => {
  const file = fotoInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = e => {
      preview.src = e.target.result;
      preview.style.display = "block";
    };
    reader.readAsDataURL(file);
  }
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const instagram = document.getElementById("instagram").value.trim();
  const genero = document.getElementById("genero").value;
  const interesse = document.getElementById("interesse").value;
  const fotoFile = fotoInput.files[0];
  const userId = localStorage.getItem("userId");

  if (!userId) {
    alert("Usuário não identificado.");
    return;
  }

  try {
    console.log("📸 Iniciando upload da imagem...");

    let fotoURL = "";

    if (fotoFile) {
      const storageRef = ref(storage, `usuarios/${userId}/foto.jpg`);
      await uploadBytes(storageRef, fotoFile);
      fotoURL = await getDownloadURL(storageRef);
    }

    const userRef = doc(db, "usuarios", userId);
    await updateDoc(userRef, {
      instagram,
      genero,
      interesse,
      fotoURL
    });

    alert("✅ Perfil salvo com sucesso!");
    window.location.href = "curtidas.html";

  } catch (err) {
    console.error("❌ Erro ao salvar perfil:", err);
    alert("Erro ao salvar o perfil.");
  }
});
