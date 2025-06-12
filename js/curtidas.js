import { db } from './firebase.js';
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const userId = localStorage.getItem("userId");
const container = document.getElementById("curtidasContainer");

async function carregarCurtidas() {
  const q = query(collection(db, "likes"), where("quemFoiCurtido", "==", userId));
  const snap = await getDocs(q);

  container.innerHTML = "";

  if (snap.empty) {
    container.innerHTML = "<p>Ninguém curtiu você ainda 😢</p>";
    return;
  }

  for (let docLike of snap.docs) {
    const id = docLike.data().quemCurtiu;
    const docUser = await getDoc(doc(db, "usuarios", id));
    const dados = docUser.data();

    const card = document.createElement("div");
    card.className = "curtida-card";
    card.innerHTML = `
      <img src="${dados.fotoURL}" alt="Foto de ${dados.nome}" />
      <h3>${dados.nome}</h3>
      <p>@${dados.instagram}</p>
    `;
    container.appendChild(card);
  }
}

carregarCurtidas();
