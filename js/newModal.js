// Firebase 모듈 불러오기
import { db, doc, deleteDoc } from './firebase.js';

// 모달 요소 선택
const $modal = $('#memberModal');
const $modalImage = $('#modalImage');
const $modalName = $('#modalName');
const $modalMbti = $('#modalMbti');
const $modalIntroduction = $('#modalIntroduction');
const $modalBlogLink = $('#modalBlogLink');
const $modalHobby = $('#modalHobby');
const $modalCollaborationStyle = $('#modalCollaborationStyle');
const $modalStrengths = $('#modalStrengths');
const $modalResolution = $('#modalResolution');
const $closeBtn = $('.close-btn');
const $modalDel = $('#modalDel'); // 삭제 버튼
const $modalModi = $('#modalModi'); // 수정 버튼
const $modalFooter = $('.modalWrap-footer'); // 수정 및 삭제 버튼 래퍼

let currentDocId = null; // 현재 열려 있는 멤버의 Firebase 문서 ID

// 모달 열기 함수
function openModal(memberData) {
    currentDocId = memberData.docId;

    $modalImage.attr('src', memberData.imageUrl);
    $modalName.text(memberData.name);
    $modalMbti.text(`${memberData.mbti}`);
    $modalIntroduction.text(memberData.introduction);
    $modalHobby.text(memberData.hobby);
    $modalCollaborationStyle.text(memberData.collaborationStyle);
    $modalStrengths.text(memberData.strengths);
    $modalResolution.text(memberData.resolution);

    const blogLink = memberData.blogLink.startsWith('http')
        ? memberData.blogLink
        : `https://${memberData.blogLink}`;
    $modalBlogLink.attr('href', blogLink).text('💚블로그 보러 가기💚');

    // editMode가 true일 때만 수정/삭제 버튼 보이도록 설정
    const isEditMode = sessionStorage.getItem('editMode') === 'true';
    $modalFooter.css('display', isEditMode ? 'flex' : 'none');

    $modal.fadeIn(); // 모달 열기 애니메이션
    $('#memberModal').css('display', 'flex');
    $('body').css('overflow', 'hidden'); // 스크롤 막기
}

// 모달 닫기 함수
$closeBtn.on('click', function () {
    $modal.fadeOut(); // 모달 닫기 애니메이션
    $('body').css('overflow', ''); // 스크롤 해제
});

// 모달 외부 클릭 시 닫기
$(window).on('click', function (event) {
    if ($(event.target).is($modal)) {
        $modal.fadeOut();
        $('body').css('overflow', ''); // 스크롤 해제
    }
});

// 탭 전환 기능
$('.modal-tab').on('click', function () {
    // 모든 탭에서 active 클래스 제거
    $('.modal-tab').removeClass('active');
    $('.modal-tab-content').removeClass('active');

    // 선택된 탭에 active 클래스 추가
    $(this).addClass('active');

    // 선택된 탭에 따라 보여줄 콘텐츠의 ID 결정
    const contentId =
        $(this).attr('id') === 'introTab' ? '#introContent' : '#tmiContent';

    // 모든 콘텐츠 숨기고, 선택된 콘텐츠에만 active 클래스 추가
    $('.modal-tab-content').hide();
    $(contentId).show().addClass('active');
});

// 수정 버튼 클릭 이벤트
$modalModi.click(function () {
    window.location.href = `addcard.html?name=${$modalName.text()}`;
});

// 삭제 버튼 클릭 이벤트
$modalDel.click(async function () {
    if (currentDocId) {
        const confirmation = confirm('정말로 이 멤버를 삭제하시겠습니까?');

        if (confirmation) {
            try {
                await deleteDoc(doc(db, 'members', currentDocId));
                alert('멤버 카드가 삭제되었습니다.');
                $modal.fadeOut();
                $('body').css('overflow', ''); // 스크롤 해제

                location.reload(); // 페이지 새로고침
            } catch (error) {
                console.error('삭제 중 오류 발생:', error);
                alert('삭제하는 동안 오류가 발생했습니다.');
            }
        }
    } else {
        alert('문서 ID가 존재하지 않습니다.');
    }
});

export { openModal };
