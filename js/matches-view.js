
import { db } from './firebase.js';
import {
  doc,
  getDoc,
  getDocs,
  collection,
  query,
  where
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const userId = localStorage.getItem('userId');
const lista = document.getElementById("listaMatches");

if (!userId) {
  alert("Erro: usuário não logado.");
  window.location.href = "index.html";
}

async function carregarMatches() {
  const q = query(
    collection(db, "matches"),
    where("pessoa1", "==", userId)
  );
  const q2 = query(
    collection(db, "matches"),
    where("pessoa2", "==", userId)
  );

  const [snap1, snap2] = await Promise.all([getDocs(q), getDocs(q2)]);
  const matches = new Set();

  snap1.forEach(doc => matches.add(doc.data().pessoa2));
  snap2.forEach(doc => matches.add(doc.data().pessoa1));

  for (const matchId of matches) {
    const docSnap = await getDoc(doc(db, "usuarios", matchId));
    if (docSnap.exists()) {
      const dados = docSnap.data();
      const div = document.createElement("div");
      div.classList.add("perfil-card");
      div.innerHTML = `
        <img src="${dados.fotoURL}" alt="${dados.nome}">
        <h3>${dados.nome}</h3>
        <p>@${dados.instagram || "sem insta"}</p>
      `;
      lista.appendChild(div);
    }
  }
}

carregarMatches();
