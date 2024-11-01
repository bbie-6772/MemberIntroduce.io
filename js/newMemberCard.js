import { db, getDocs, collection, query } from './firebase.js';
import { openModal } from './newModal.js';

// 멤버 카드 생성 함수
async function createMemberCards() {
    const $cardContainer = $('#cardContainer'); // 카드 컨테이너 요소 선택
    $cardContainer.empty(); // 기존 카드 초기화

    // Firebase에서 데이터 가져오기
    const docs = await getDocs(query(collection(db, 'members')));

    // 각 멤버 데이터를 사용하여 카드 생성
    docs.forEach((docRef) => {
        const row = docRef.data();

        const docId = docRef.id;
        const blogLink = row['blogLink'];
        const collaborationStyle = row['collaborationStyle'];
        const hobby = row['hobby'];
        const imageUrl = row['imageUrl'];
        const introduction = row['introduction'];
        const mbti = row['mbti'];
        const name = row['name'];
        const resolution = row['resolution'];
        const strengths = row['strengths'];

        // 카드 요소 생성 및 데이터 할당
        const $card = $(`
            <div class="myteamcard">
                <img src="${imageUrl}" alt="이미지">
                <div class="card-content">
                    <div class="card-content-title">
                        <h3 class="card-title">${name}</h3>
                        <p class="card-mbti">${mbti}</p>
                    </div>
                    <p class="card-description">${introduction}</p>
                </div>
            </div>
        `);

        let isDragging = false;

        // 카드 클릭 이벤트 - 드래그가 아닌 경우에만 모달 열기
        $card
            .on('mousedown', function () {
                isDragging = false;
            })
            .on('mousemove', function () {
                isDragging = true;
            })
            .on('mouseup', function () {
                if (!isDragging) {
                    openModal({
                        blogLink,
                        collaborationStyle,
                        hobby,
                        imageUrl,
                        introduction,
                        mbti,
                        name,
                        resolution,
                        strengths,
                        docId,
                    });
                }
            });

        // 카드 삽입
        $cardContainer.append($card);
    });

    // 편집 모드 여부에 따라 플러스 버튼 추가
    const isEditMode = sessionStorage.getItem('editMode') === 'true';

    if (isEditMode) {
        // 편집 모드일 때만 카드 추가 버튼을 생성하여 추가
        const $addCardButton = $(`
            <button id="plsbtn" type="button" class="plsbt">
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDMCyyoX0vaRyKKoMOpIYS0LA94ZYOKGJmHvd_8g-KJIbLX1XVImG79MgC04rNNm46jJk&usqp=CAU" alt="추가 버튼 이미지" />
            </button>
        `);

        // 추가 버튼 클릭 이벤트 설정
        $addCardButton.on('click', function () {
            window.location.href = 'addcard.html';
        });

        // 카드 컨테이너에 추가 버튼 삽입
        $cardContainer.append($addCardButton);
    }

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
}

// 페이지 로드 시 카드 생성 함수 호출
createMemberCards();

export { createMemberCards };
