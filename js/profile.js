import { db, storage } from "./firebase.js";
import {
  doc, getDoc, updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import {
  ref, uploadBytes, getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

const userId = localStorage.getItem("userId");
if (!userId) {
  window.location.href = "index.html";
}

const userRef = doc(db, "usuarios", userId);
const form = document.getElementById("profileForm");

(async () => {
  const snapshot = await getDoc(userRef);
  const data = snapshot.data();
  if (data?.idade && data?.genero && data?.buscaGenero && data?.fotoURL) {
    window.location.href = "explorar.html";
  }
})();

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const idade = document.getElementById("idade").value;
  const genero = document.getElementById("genero").value;
  const buscaGenero = document.getElementById("buscaGenero").value;
  const instagram = document.getElementById("instagram").value;
  const descricao = document.getElementById("descricao").value;
  const musica = document.getElementById("musica").value;
  const foto = document.getElementById("foto").files[0];

  if (!foto) {
    alert("Por favor, selecione uma imagem.");
    return;
  }

  const storageRef = ref(storage, `fotos/${userId}`);
  await uploadBytes(storageRef, foto);
  const fotoURL = await getDownloadURL(storageRef);

  await updateDoc(userRef, {
    idade,
    genero,
    buscaGenero,
    instagram,
    descricao,
    musicaKaraoke: musica,
    fotoURL
  });

  window.location.href = "explorar.html";
});
