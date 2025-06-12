import { db } from "./firebase.js";
import { collection, getDocs } from "firebase/firestore";

const userId = localStorage.getItem("userId");
if (!userId) {
  alert("Usuário não logado");
}

// Correção: passa `db` como primeiro argumento
const curtidasRef = collection(db, "curtidas");

async function carregarCurtidas() {
  try {
    const querySnapshot = await getDocs(curtidasRef);
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.destinatario === userId) {
        console.log("Você foi curtido por:", data.remetente);
        // Aqui você pode exibir a curtida na interface
      }
    });
  } catch (error) {
    console.error("Erro ao carregar curtidas:", error);
  }
}

carregarCurtidas();
