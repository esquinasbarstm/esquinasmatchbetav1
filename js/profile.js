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
  console.log("🔑 userId encontrado:", userId);

  if (!userId) {
    alert("Erro: usuário não logado.");
    return;
  }

  if (!foto) {
    alert("Envie uma foto.");
    return;
  }

  try {
    console.log("🟡 Iniciando upload da imagem...");
    const storageRef = ref(storage, `fotosPerfis/${Date.now()}-${foto.name}`);
    await uploadBytes(storageRef, foto);
    const fotoURL = await getDownloadURL(storageRef);
    console.log("✅ Imagem salva:", fotoURL);

    const userRef = doc(db, "usuarios", userId);
    await updateDoc(userRef, {
      fotoURL,
      instagram,
      genero,
