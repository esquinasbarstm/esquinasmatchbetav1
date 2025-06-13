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
  const matchesQuery = query(
    collection(db, "matches"),
    where("usuarios", "array-contains", userId)
  );

  const snapshot = await getDocs(matchesQuery);
  const matchIds = [];

  snapshot.forEach(doc => {
    const data = doc.data();
    const outroId = data.usuarios.find(id => id !== userId);
    if (outroId) matchIds.push(outroId);
  });

  container.innerHTML = "";

  if (matchIds.length === 0) {
    container.innerHTML = "<p>Nenhum match encontrado ainda 😢</p>";
    return;
  }

  for (let id of matchIds) {
    const docUser = await getDoc(doc(db, "usuarios", id));
    if (!docUser.exists()) continue;

    const dados = docUser.data();

    const card = document.createElement("div");
    card.className = "match-card";
    card.innerHTML = `
      <img src="${dados.fotoURL || 'https://via.placeholder.com/150'}" alt="Foto de ${dados.nome}" />
      <h3>${dados.nome}</h3>
      <p>@${dados.instagram || 'sem_insta'}</p>
    `;
    container.appendChild(card);
  }
}

carregarMatches();
