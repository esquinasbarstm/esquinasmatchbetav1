import { db } from './firebase.js';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  query,
  where,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const userId = localStorage.getItem("userId");
const meuGeneroBuscado = localStorage.getItem("buscaGenero"); // Ex: "Homens", "Mulheres", "Todos"
const meuGenero = localStorage.getItem("genero"); // Ex: "Homem", "Mulher"
const perfisContainer = document.getElementById("perfisContainer");
const matchPopup = document.getElementById("matchPopup");

async function carregarPerfis() {
  const usuariosSnap = await getDocs(collection(db, "usuarios"));

  // Quem já curtiu
  const curtidasSnap = await getDocs(query(
    collection(db, "likes"),
    where("quemCurtiu", "==", userId)
  ));
  const idsCurtidos = curtidasSnap.docs.map(doc => doc.data().quemFoiCurtido);

  perfisContainer.innerHTML = "";

  usuariosSnap.forEach(async (docUser) => {
    if (docUser.id === userId) return;

    const dados = docUser.data();

    // Validação de perfil completo
    if (!dados.nome || !dados.instagram || !dados.genero || !dados.buscaGenero || !dados.fotoURL) return;

    // Filtro por interesse (exibir apenas se a pessoa busca meu gênero, e eu busco o dela)
    const elaMeBusca = dados.buscaGenero === "Todos" || dados.buscaGenero === meuGenero;
    const euBuscoEla = meuGeneroBuscado === "Todos" || meuGeneroBuscado === dados.genero;

    if (!elaMeBusca || !euBuscoEla) return;

    const jaCurtiu = idsCurtidos.includes(docUser.id);

    const card = document.createElement("div");
    card.className = "perfil-card";
    card.innerHTML = `
      <img src="${dados.fotoURL}" alt="Foto de ${dados.nome}" />
      <h3>${dados.nome}</h3>
      <p>@${dados.instagram}</p>
      <p>${dados.genero} • Busca: ${dados.buscaGenero}</p>
      <button class="like-btn" data-id="${docUser.id}" ${jaCurtiu ? "disabled" : ""}>
        ${jaCurtiu ? "❤️ Curtido" : "❤️ Curtir"}
      </button>
    `;
    perfisContainer.appendChild(card);
  });

  // Interação com curtidas
  perfisContainer.addEventListener("click", async (e) => {
    if (e.target.classList.contains("like-btn") && !e.target.disabled) {
      const alvoId = e.target.getAttribute("data-id");

      await addDoc(collection(db, "likes"), {
        quemCurtiu: userId,
        quemFoiCurtido: alvoId,
        timestamp: serverTimestamp()
      });

      // Verifica se já recebeu curtida de volta
      const q = query(collection(db, "likes"),
        where("quemCurtiu", "==", alvoId),
        where("quemFoiCurtido", "==", userId)
      );
      const snap = await getDocs(q);

      if (!snap.empty) {
        await addDoc(collection(db, "matches"), {
          user1: userId,
          user2: alvoId,
          criadoEm: serverTimestamp()
        });

        const docAlvo = await getDoc(doc(db, "usuarios", alvoId));
        const nomeAlvo = docAlvo.data().nome;
        showMatchPopup(nomeAlvo);
      }

      e.target.disabled = true;
      e.target.textContent = "❤️ Curtido";
    }
  });
}

function showMatchPopup(nome) {
  const codigo = "ESQ-MATCH-" + Math.floor(100 + Math.random() * 900);
  matchPopup.innerHTML = `
    🎉 Você deu match com <strong>${nome}</strong>!<br>
    <small>Mostre esse código no bar para ganhar sua caipirinha:</small><br>
    <div style="margin-top:8px; font-size: 1.2em; background: #fff; color: #111; padding: 6px 12px; border-radius: 8px;">${codigo}</div>
  `;
  matchPopup.style.display = "block";
  matchPopup.style.animation = "fadein 0.3s ease";
  setTimeout(() => {
    matchPopup.style.display = "none";
  }, 7000);
}

carregarPerfis();
