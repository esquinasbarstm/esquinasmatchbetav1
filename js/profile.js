
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

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const foto = document.getElementById('foto').files[0];
  const instagram = document.getElementById('instagram').value.trim();
  const genero = document.getElementById('genero').value;
  const interesse = document.getElementById('interesse').value;

  const userId = localStorage.getItem('userId');
  if (!userId) {
    alert("Erro: usuário não logado.");
    return;
  }

  if (!foto) {
    alert("Envie uma foto.");
    return;
  }

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
});
