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
const container = document.getElementById("matchesContainer");

async function carregarMatches() {
  const q1 = query(collection(db, "matches"), where("user1", "==", userId));
  const q2 = query(collection(db, "matches"), where("user2", "==", userId));

  const [snap1, snap2] = await Promise.all([getDocs(q1), getDocs(q2)]);

  const matches = [];

  snap1.forEach(doc => matches.push(doc.data().user2));
  snap2.forEach(doc => matches.push(doc.data().user1));

  container.innerHTML = "";

  if (matches.length === 0) {
    container.innerHTML = "<p>Nenhum match encontrado ainda 😢</p>";
    return;
  }

  for (let id of matches) {
    const docUser = await getDoc(doc(db, "usuarios", id));
    const dados = docUser.data();

    const card = document.createElement("div");
    card.className = "match-card";
    card.innerHTML = `
      <img src="${dados.fotoURL}" alt="Foto de ${dados.nome}" />
      <h3>${dados.nome}</h3>
      <p>@${dados.instagram}</p>
    `;
    container.appendChild(card);
  }
}

carregarMatches();
