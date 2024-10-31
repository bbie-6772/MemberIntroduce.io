import {
    db,
    storage,
    collection,
    addDoc,
    getDocs,
    setDoc,
    doc,
    ref,
    uploadBytes,
    getDownloadURL,
} from './firebase.js';

// url에서 name(변경될 수 있음) 파라미터 가져오기
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

const nameParam = getQueryParam('name');
let documentId = null; // Firebase 문서ID

// 파라미터 name 값이 존재할 경우, 해당 값으로 데이터 가져오기
if (nameParam) {
    $(document).ready(async function () {
        const memberRef = collection(db, 'members');
        const querySnapshot = await getDocs(memberRef);

        querySnapshot.forEach((doc) => {
            const data = doc.data();

            if (data.name === nameParam) {
                documentId = doc.id; // 문서 ID 저장
                $('#name').val(data.name);
                $('#mbti').val(data.mbti).change();
                $('#blogLink').val(data.blogLink);
                $('#hobby').val(data.hobby);
                $('#introduction').val(data.introduction);
                $('#strengths').val(data.strengths);
                $('#collaborationStyle').val(data.collaborationStyle);
                $('#resolution').val(data.resolution);

                $('#title').text('멤버 카드 수정하기');
                $('#submit').text('수정하기');

                if (data.imageUrl) {
                    $('#imagePreview').html(
                        `<img src="${data.imageUrl}" style="max-width: 100%; max-height: 100%;" alt="미리보기 이미지">`
                    );
                }
            }
        });
    });
}

// 취소하기 버튼 클릭 시 이벤트
$('#cancel').click(function () {
    history.back();
});

// 제출하기 버튼 클릭 시 이벤트
$('#memberForm').on('click', 'button[type="submit"]', async function (e) {
    e.preventDefault();

    // 입력 데이터 수집
    const name = $('#name').val();
    const mbti = $('#mbti').val();
    const blogLink = $('#blogLink').val();
    const hobby = $('#hobby').val();
    const introduction = $('#introduction').val();
    const strengths = $('#strengths').val();
    const collaborationStyle = $('#collaborationStyle').val();
    const resolution = $('#resolution').val();
    const imageFile = $('#imageUpload')[0].files[0];
    // const oriFileName = $('#imageUpload')[0].files[0]?.name;

    // 입력 값 검증
    if (!nameParam) {
        if (
            !name ||
            !mbti ||
            !blogLink ||
            !hobby ||
            !introduction ||
            !strengths ||
            !collaborationStyle ||
            !resolution ||
            !imageFile
        ) {
            alert('모든 항목을 입력해 주세요.');
            return;
        }
    } else {
        if (
            !name ||
            !mbti ||
            !blogLink ||
            !hobby ||
            !introduction ||
            !strengths ||
            !collaborationStyle ||
            !resolution
        ) {
            alert('모든 항목을 입력해 주세요.');
            return;
        }
    }

    try {
        let imageUrl = '';

        if (imageFile) {
            // 이미지 파일 업로드
            const storageRef = ref(storage, 'images/' + imageFile.name);
            await uploadBytes(storageRef, imageFile);
            imageUrl = await getDownloadURL(storageRef);
        }

        // Firestore에 데이터 추가
        const docData = {
            name: name,
            mbti: mbti,
            blogLink: blogLink,
            hobby: hobby,
            introduction: introduction,
            strengths: strengths,
            collaborationStyle: collaborationStyle,
            resolution: resolution,
            // imageUrl: imageUrl,
            // oriFileName: oriFileName
        };

        // imageUrl이 존재할 경우에만 필드 추가
        if (imageUrl !== '') {
            docData.imageUrl = imageUrl;
        }

        if (nameParam && documentId) {
            // 멤버 업데이트 로직
            const memberDocRef = doc(db, 'members', documentId);
            await setDoc(memberDocRef, docData, {
                merge: true,
            });
            alert('멤버 카드가 성공적으로 수정되었습니다!');
            window.location.href = 'index.html';
        } else {
            // 새로운 멤버 추가 로직
            await addDoc(collection(db, 'members'), docData);
            alert('멤버 카드가 성공적으로 추가되었습니다!');
            window.location.href = 'index.html';
        }
    } catch (e) {
        console.error('에러발생!: ', e);
        alert('오류가 발생했습니다. 다시 시도해 주세요.');
    }
});

// 이미지 미리보기 기능 추가
$('#imageUpload').on('change', function (e) {
    const [file] = e.target.files;

    if (file) {
        $('#imagePreview').html(
            `<img src="${URL.createObjectURL(
                file
            )}" style="max-width: 100%; max-height: 100%;" alt="미리보기 이미지">`
        );
    }
});

// MBTI 셀렉트 박스 초기 색상 설정
$('#mbti').css('color', '#6c757d');

// MBTI 셀렉트 박스 색상 변경
$('#mbti').on('change', function () {
    if ($(this).val() === '') {
        $(this).css('color', '#6c757d');
    } else {
        $(this).css('color', '#000000');
    }
});
