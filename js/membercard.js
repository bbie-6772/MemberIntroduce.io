import { db, collection, getDocs } from './firebase.js';

async function loadCards() {
    const cardContainer = document.getElementById('cardlist');
    const docs = await getDocs(collection(db, 'members'));
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
        <div class="card-content-title">
            <h3 class="card-title">${data.name}</h3>
            <p class="card-mbti">${data.mbti}</p>
        </div>
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
    $('#plsbtn').click(function () {
        window.location.href = 'addcard.html';
    });

    const $scrollContainer = $('.memberCardWrap__content');
    let isDown = false;
    let startX;
    let scrollLeft;

    $scrollContainer.on('mousedown', function (e) {
        isDown = true;
        $scrollContainer.addClass('active');
        startX = e.pageX - $scrollContainer.offset().left;
        scrollLeft = $scrollContainer.scrollLeft();
        return false;
    });

    $(document).on('mouseup', function () {
        isDown = false;
        $scrollContainer.removeClass('active');
    });

    $(document).on('mousemove', function (e) {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - $scrollContainer.offset().left;
        const walk = (x - startX) * 1;
        $scrollContainer.scrollLeft(scrollLeft - walk);
    });
});

