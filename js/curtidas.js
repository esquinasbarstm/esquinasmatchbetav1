
import { db } from './firebase.js';
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const userId = localStorage.getItem('userId');
if (!userId) {
  alert("Erro: usuário não logado.");
  window.location.href = "index.html";
}

const container = document.getElementById("curtidasRecebidas");

async function carregarCurtidas() {
  const q = query(
    collection(db, "likes"),
    where("quemFoiCurtido", "==", userId)
  );

  const snap = await getDocs(q);
  const curtidas = [];

  for (const docLike of snap.docs) {
    const quemCurtiu = docLike.data().quemCurtiu;

    const q2 = query(
      collection(db, "likes"),
      where("quemCurtiu", "==", userId),
      where("quemFoiCurtido", "==", quemCurtiu)
    );
    const resposta = await getDocs(q2);

    if (resposta.empty) {
      const userDoc = await getDoc(doc(db, "usuarios", quemCurtiu));
      if (userDoc.exists()) {
        const u = userDoc.data();
        curtidas.push({ id: quemCurtiu, ...u });
      }
    }
  }

  curtidas.forEach((user) => {
    const div = document.createElement("div");
    div.classList.add("perfil-card");
    div.innerHTML = `
      <img src="${user.fotoURL}" alt="${user.nome}">
      <h3>${user.nome}</h3>
      <p>@${user.instagram || "sem insta"}</p>
    `;
    container.appendChild(div);
  });
}

carregarCurtidas();
