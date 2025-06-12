import { db, storage } from './firebase.js';
import {
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import {
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

const form = document.getElementById('profileForm');
const fotoInput = document.getElementById("foto");
const preview = document.getElementById("preview");

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const instagram = document.getElementById('instagram').value.trim();
  const genero = document.getElementById('genero').value;
  const interesse = document.getElementById('interesse').value;
  const foto = fotoInput.files[0];

  const userId = localStorage.getItem('userId');
  if (!userId) {
    alert("Erro: usuário não logado.");
    return;
  }

  if (!foto) {
    alert("Envie uma foto.");
    return;
  }

  try {
    const storageRef = ref(storage, `fotosPerfis/${Date.now()}-${foto.name}`);
    await uploadBytes(storageRef, foto);
    const fotoURL = await getDownloadURL(storageRef);

    const userRef = doc(db, "usuarios", userId);
    await updateDoc(userRef, {
      fotoURL,
      instagram,
      genero,
      interesse
    });

    alert("Perfil salvo com sucesso!");
    window.location.href = "matches.html";
  } catch (error) {
    console.error("Erro ao salvar perfil:", error);
    alert("Erro ao salvar. Tente novamente.");
  }
});

// Preview da imagem
fotoInput.addEventListener("change", () => {
  const file = fotoInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      preview.src = e.target.result;
      preview.style.display = "block";
    };
    reader.readAsDataURL(file);
  }
});
