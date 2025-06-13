// curtidas.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import {
  getStorage,
  ref,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDqyuCh4pOphH_Izal6hoytjy3CZG5XkT8",
  authDomain: "esquinas-match.firebaseapp.com",
  projectId: "esquinas-match",
  storageBucket: "esquinas-match.appspot.com",
  messagingSenderId: "1047206691859",
  appId: "1:1047206691859:web:b3f4b94c00098843762be6"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

const userId = localStorage.getItem("userId");
const container = document.getElementById("curtidasContainer");

if (!userId) {
  alert("Você precisa estar logado para ver suas curtidas.");
  window.location.href = "index.html"; // ou login.html
} else {
  carregarCurtidas();
}

async function carregarCurtidas() {
  try {
    const likesRef = collection(db, "likes");
    const q = query(likesRef, where("quemFoiCurtido", "==", userId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      container.innerHTML = "<p>Ninguém curtiu você ainda 😢</p>";
      return;
    }

    const curtidasPromises = querySnapshot.docs.map(async (docSnap) => {
      const quemCurtiu = docSnap.data().quemCurtiu;

      if (!quemCurtiu) return;

      const userRef = doc(db, "usuarios", quemCurtiu);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) return;

      const userData = userSnap.data();
      const fotoUrl = userData.fotoUrl || await getDownloadURL(ref(storage, `fotosPerfil/${quemCurtiu}`));

      const card = document.createElement("div");
      card.className = "perfil-card";
      card.innerHTML = `
        <img src="${fotoUrl}" alt="${userData.nome}" />
        <h3>${userData.nome}</h3>
        <p>@${userData.instagram}</p>
        <button data-id="${quemCurtiu}">Curtir de volta ❤️</button>
      `;

      const btn = card.querySelector("button");
      btn.addEventListener("click", async () => {
        await setDoc(doc(db, "likes", `${userId}_${quemCurtiu}`), {
          quemCurtiu: userId,
          quemFoiCurtido: quemCurtiu,
          timestamp: Date.now()
        });

        const matchId = `${quemCurtiu}_${userId}`;
        const matchDoc = await getDoc(doc(db, "likes", matchId));

        if (matchDoc.exists()) {
          await setDoc(doc(db, "matches", `${userId}_${quemCurtiu}`), {
            usuario1: userId,
            usuario2: quemCurtiu,
            timestamp: Date.now()
          });
          alert(`🎉 Você deu match com ${userData.nome}!`);
        } else {
          alert(`Você curtiu ${userData.nome}.`);
        }

        btn.disabled = true;
        btn.innerText = "Curtido!";
      });

      container.appendChild(card);
    });

    await Promise.all(curtidasPromises);

  } catch (error) {
    console.error("Erro ao carregar curtidas:", error);
    container.innerHTML = "<p>Erro ao carregar curtidas. Tente novamente.</p>";
  }
}
