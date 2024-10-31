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

            // popup



            // 팝업 // 클릭 이벤트 핸들러 추가
            cardElement.click(function () {
                // $('#popup-name').text(name);  // 클릭한 카드의 이름을 팝업에 설정

                let temp_pop = `
            <div id="removePop">
                <div class="row">
                    <div id="imgsbox" class="col-3">
                        <div class="imgcard">
                            <img id="memberImg" src="${data.imageUrl}" class="card-img-top" alt="...">
                            <div>
                                <div class="row">

                                    <!--블로그버튼-->
                                    <button id="blBtn" type="button" class="col btn btn-outline-success">
                                        <a href="${data.blogLink}" target="_blank" rel="noopener noreferrer">
                                            <img id="link_img"
                                                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTq_V5ImHw0BTMnCJ4GSqBsDdD-bxLsyuCh4Q5V7XX2aiVuxCbTG6RT2151CA1-G6XaE7k&usqp=CAU"
                                                class="card-img-top" alt="...">
                                        </a>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col"></div>
                    <div id="infobox" class="col-8">
                        <div id="infoup" class="row">
                            <div id="info1" class="col-3">
                                <table class="table">
                                    <thead>
                                        <tr>
                                            <th scope="col">이름</th>
                                            <th scope="col">${data.name}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <th scope="row">MBTI</th>
                                            <td>${data.mbti}</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">취미</th>
                                            <td>${data.hobby}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div id="info2" class="col-5">
                                <ul class=" list-group">
                                    <p>${data.introduction}</p>
                                </ul>
                            </div>
                            <div class="col">
                                <button onclick='reviseBtn()' id="reviseBtn" type="button" class="btn btn-outline-secondary">수정</button>
<!--
<button onclick='deleteBtn("${data.name}")' id="deleteBtn" type="button" class="btn btn-outline-secondary">삭제</button>
-->
<button id="deleteBtn" type="button" name="delete"  class="btn btn-outline-secondary">삭제</button>
</div>
                        </div>
                        <div id="infodown" class="row">
                            <div id="info3" class="col-8">
                                <ul class=" list-group">
                                    <p id="strengths" style="display: none;">${data.strengths}</p>
                                    <p id="collaborationStyle" style="display: none;">${data.collaborationStyle}</p>
                                    <p id="resolution" style="display: none;">${data.resolution}</p>
                                </ul>
                            </div>
                            <div class="col-2">
                                <div class="btn-group-vertical" role="group" aria-label="Vertical radio toggle button group">
                                    <input type="radio" class="btn-check" name="vbtn-radio" id="vbtn-radio1" autocomplete="off"
                                        checked>
                                    <label onclick="strengthsBtn()" class="btn btn-outline-danger" for="vbtn-radio1">장점</label>
                                    <input type="radio" class="btn-check" name="vbtn-radio" id="vbtn-radio2" autocomplete="off">
                                    <label onclick="resolutionBtn()" class="btn btn-outline-danger" for="vbtn-radio2">각오</label>
                                    <input type="radio" class="btn-check" name="vbtn-radio" id="vbtn-radio3" autocomplete="off">
                                    <label onclick="collaborationStyleBtn()" class="btn btn-outline-danger"
                                        for="vbtn-radio3">협업스타일</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`


                // 전역 변수로 PopCardElement 선언
                let PopCardElement = $(temp_pop).insertBefore('#popup_content');
                $('#popup').css('display', 'flex');  // 팝업 열기
                $("#strengths").show();
                // $("#collaborationStyle").hide();
                // $("#resolution").hide();
                console.log('팝업 열림');


                $(document).on("click", "button[name='delete']", async function () {
                    try {
                        // Firestore에서 문서 삭제
                        const docRef = doc(db, "members", $(this).prev().prev().text());
                        await deleteDoc(docRef);
                        console.log("await deketeDoc")

                        // 성공 메시지 및 DOM 요소 제거
                        alert("성공적으로 삭제되었습니다!");
                        $(this).parent().remove();
                        document.getElementById("removePop").remove();

                        // 팝업 닫기
                        $("#popup").css("display", "none");
                        console.log('$("#popup").css("display", "none");');
                    } catch (error) {
                        console.log("문서 삭제 오류:", error);
                        alert("삭제 중 오류가 발생했습니다.");
                    }
                });

                window.reviseBtn = function () {
                    window.location.href = 'addcard.html';
                    console.log(name + '수정하기')
                }

                // 모듈 스크립트에서 전역 deleteBtn 함수 생성
                // 이름을 못가져옴.
            })
            /////////////////////////////


            // 장점
            window.strengthsBtn = function () {
                // 원하는 기능
                $("#strengths").show();
                $("#collaborationStyle").hide();
                $("#resolution").hide();
            };

            // 협업 스타일
            window.collaborationStyleBtn = function () {
                $("#strengths").hide();
                $("#collaborationStyle").show();
                $("#resolution").hide();
            };

            // 각오
            window.resolutionBtn = function () {

                $("#strengths").hide();
                $("#collaborationStyle").hide();
                $("#resolution").show();
            };

        });


        // 팝업 닫기 버튼 클릭 시 팝업을 닫습니다.        
        $("#clbtn").click(function () {
            document.getElementById("removePop").remove();
            $("#popup").css("display", "none"); console.log(' $("#popup").css("display", "none");')
        })

        // popup

    };
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