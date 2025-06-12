
import { db } from './firebase.js';
import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
  query,
  where
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const userId = localStorage.getItem('userId');
if (!userId) {
  alert("Erro: usuário não logado.");
  window.location.href = "index.html";
}

const lista = document.getElementById("listaPerfis");
const matchPopup = document.getElementById("matchPopup");

async function carregarPerfis() {
  const snap = await getDocs(collection(db, "usuarios"));
  snap.forEach(docUser => {
    if (docUser.id !== userId) {
      const dados = docUser.data();
      const div = document.createElement("div");
      div.classList.add("perfil-card");
      div.innerHTML = `
        <img src="${dados.fotoURL}" alt="${dados.nome}" class="foto-perfil">
        <h3>${dados.nome}</h3>
        <p>@${dados.instagram || "sem insta"}</p>
        <button onclick="curtir('${docUser.id}', '${dados.nome}')">💘</button>
      `;
      lista.appendChild(div);
    }
  });
}

window.curtir = async (alvoId, nomeAlvo) => {
  try {
    await addDoc(collection(db, "likes"), {
      quemCurtiu: userId,
      quemFoiCurtido: alvoId,
      timestamp: serverTimestamp()
    });

    const q = query(
      collection(db, "likes"),
      where("quemCurtiu", "==", alvoId),
      where("quemFoiCurtido", "==", userId)
    );

    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      await addDoc(collection(db, "matches"), {
        pessoa1: userId,
        pessoa2: alvoId,
        criadoEm: serverTimestamp()
      });

      showMatchPopup(nomeAlvo);
    } else {
      alert(`Você curtiu ${nomeAlvo}!`);
    }
  } catch (e) {
    console.error("Erro ao curtir:", e);
    alert("Erro ao curtir.");
  }
};


function showMatchPopup(nome) {
  const codigo = "ESQ-MATCH-" + Math.floor(100 + Math.random() * 900);
  matchPopup.innerHTML = `
    🎉 Você deu match com <strong>${nome}</strong>!<br>
    <small>Mostre esse código no bar para ganhar sua caipirinha:</small><br>
    <div style="margin-top:8px; font-size: 1.2em; background: #fff; color: #111; padding: 6px 12px; border-radius: 8px;">
      ${codigo}
    </div>
  `;
  matchPopup.style.display = "block";
  setTimeout(() => {
    matchPopup.style.display = "none";
  }, 9000);
}

  matchPopup.textContent = `🎉 Você deu match com ${nome}!`;
  matchPopup.style.display = "block";
  setTimeout(() => {
    matchPopup.style.display = "none";
  }, 5000);
}

carregarPerfis();
