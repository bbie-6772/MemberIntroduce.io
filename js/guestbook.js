
// firebase.js 로부터 데이터 / 함수 가져오기
import {
    db,
    getDocs,
    collection,
    deleteDoc,
    addDoc,
    doc,
    orderBy,
    query,
} from "./firebase.js";


const Comment = document.querySelector("#cmBox");
const name_point = document.querySelector("#ipName");


// comments 라이브러리의 값 가져오기
let docs = await getDocs(query(collection(db, "comments"), orderBy("createdAt")));

docs.forEach((docRef) => {

    let row = docRef.data();
    let name = row['nickName'];
    let text = row['comment'];
    let Date = row['date'];
    let when = row['createdAt'];

    //객체 생성
    const li = document.createElement("li");
    const div = document.createElement("div");
    const h3 = document.createElement("h3");
    const date = document.createElement("span");
    const span = document.createElement("span");
    const btn_del = document.createElement("button");

    // class로 style 넣어주기
    li.className = "commentLi";
    div.className = "commentDiv";
    date.className = "commentDate"
    btn_del.className = "btn btn-danger btn-sm";

    //버튼 name으로 style + 기능 묶기
    btn_del.name = "delete";
    btn_del.type = "button";
    //댓글 구분용 데이터 넣기
    h3.dataset.date = when.toDate();

    //닉네임 랜덤 색깔
    h3.style.color = "#" + parseInt(Math.random() * 0xffffff).toString(16);
    //들어갈 값 정해주기
    btn_del.textContent = "삭제";
    date.textContent = Date;
    span.innerText = text;
    h3.textContent = name;

    //구조 묶어주기 
    div.append(h3);
    div.append(date);
    li.append(div);
    li.append(span);
    li.append(btn_del);
    Comment.prepend(li);

});

// 삭제 버튼 클릭 함수
$(document).on("click", "button[name='delete']", async function () {

    // 데이터 다시 읽어오기
    let checkDocs = await getDocs(query(collection(db, "comments"), orderBy("createdAt")));
    // 삭제 버튼을 누른 댓글에서 비교할 값 가져오기
    let nameCheck = $(this).prev().prev().find("h3").text();
    // floor 및 0.001 은 날짜 값을 올렸을 때 뒷자리 3자리가 "내림" 당한 값과 비교하기 위함
    let dateCheck = Math.floor(new Date($(this).prev().prev().find("h3").data('date')).getTime() * 0.001);

    checkDocs.forEach((docRef => {

        let row = docRef.data();
        let name = row['nickName'];
        // 위 설명대로 뒷자리 3자리 배제
        let date = Math.floor(row['createdAt'].toDate() * 0.001);

        // 이름과 작성된 날짜를 비교하여 삭제할 댓글 찾기
        if (name === nameCheck && date === dateCheck) {

            //댓글을 firebase에서 삭제
            deleteDoc(doc(db, "comments", docRef.id))
            .then(() =>
                //댓글을 화면에서 삭제
                $(this).parent().remove()
                //성공 확인창 띄워주기
                .then(() =>
                    alert('성공적으로 삭제되었습니다!')
                )
            );
            

        };
    }));

});


// 작성 버튼 클릭 함수
$("#btn").click(async function () {
    $("#ipName").prev().empty();
    // 넣을 값 읽어오기 + 작성된 날짜 기록하기
    let name = document.getElementById("ipName").value;
    let text = document.getElementById("ipText").value;
    let today = new Date().toLocaleDateString();
    let now = new Date();
    // 이름과 내용이 적혀있지 않을 경우 실행되지 않도록 설계
    if (!name) {
        const span = document.createElement("span");
        span.style.color = "#f26650";
        span.textContent = "닉네임을 입력해 주세요!";

        name_point.before(span);
    } else if (!text.length) {
        const span = document.createElement("span");
        span.style.color = "#f26650";
        span.textContent = "이야기를 적어주세요!";

        name_point.before(span);
    } else if (text.length > 0) {

        //올릴 값들을 정리하는 곳
        const innerDoc = {
            nickName: name,
            comment: text,
            date: today,
            createdAt: now,
        };

        //값이 firebase에 올라가면 확인창
        await addDoc(collection(db, "comments"), innerDoc)
            .then(() =>
                alert('방명록이 성공적으로 추가되었습니다!')
            )
        document.querySelector("#ipText").value = "";

        //객체 생성
        const li = document.createElement("li");
        const div = document.createElement("div");
        const h3 = document.createElement("h3");
        const date = document.createElement("span");
        const span = document.createElement("span");
        const btn_del = document.createElement("button");

        // class로 style 넣어주기
        li.className = "commentLi";
        div.className = "commentDiv";
        date.className = "commentDate"
        btn_del.className = "btn btn-danger btn-sm";

        //버튼 name으로 style + 기능 묶기
        btn_del.name = "delete";
        btn_del.type = "button";

        //닉네임 랜덤 색깔
        h3.style.color = "#" + parseInt(Math.random() * 0xffffff).toString(16);
        //들어갈 값 정해주기
        btn_del.textContent = "삭제";
        date.textContent = today
        span.innerText = text;
        h3.textContent = name;
        h3.dataset.date = now;

        //구조 묶어주기 
        div.append(h3);
        div.append(date);
        li.append(div);
        li.append(span);
        li.append(btn_del);
        Comment.prepend(li);
    }
});