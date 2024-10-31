import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCGqR4KmttjxTiDXOgnAlq_zK85FfceU_4",
    authDomain: "sparta-1aa54.firebaseapp.com",
    projectId: "sparta-1aa54",
    storageBucket: "sparta-1aa54.appspot.com",
    messagingSenderId: "210610766907",
    appId: "1:210610766907:web:f3553a0bb7e166be9c081e",
    measurementId: "G-8ETLMBCMF2"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function loadCards() {
    const cardContainer = document.getElementById('cardlist');
    const docs = await getDocs(collection(db, "members"));
    const totalCards = docs.size;

    let loadedImages = 0;

    if (totalCards === 0) {
        document.getElementById('plsbtn').classList.add('show');
    } else {
        docs.forEach((doc) => {
            const data = doc.data();
            const tempHtml = `
<div class="myteamcard">
    <img src="${data.imageUrl}" alt="이미지">
    <div class="card-content">
        <h3 class="card-title">${data.name}</h3>
        <p class="card-description">${data.introduction}</p>
    </div>
</div>`;

            const cardElement = $(tempHtml).insertBefore('#plsbtn');

            cardElement.find('img').on('load', function () {
                loadedImages++;
                cardElement.addClass('show');

                if (loadedImages === totalCards) {
                    $('#plsbtn').addClass('show');
                }
            });
        });
    }
}

loadCards();

$(document).ready(function () {
    $("#plsbtn").click(function () {
        window.location.href = 'addcard.html';
    });
});