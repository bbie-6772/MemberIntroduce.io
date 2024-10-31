// firebase.js 로부터 데이터 / 함수 가져오기
import {
    db,
    getDocs,
    collection,
    deleteDoc,
    setDoc,
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

// 삭제 버튼 함수
$(document).on("click", "button[name='delete']", function () {
    deleteDoc(doc(db, "comments",$(this).prev().prev().text()));
    alert('성공적으로 삭제되었습니다!');
    $(this).parent().remove();
});


// 작성 버튼
$("#btn").click(async function () {
    $("#ipName").prev().empty();

    let name = document.getElementById("ipName").value;
    let text = document.getElementById("ipText").value;
    let today = new Date().toLocaleDateString();
    let now = new Date();

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

        const innerDoc = {
            nickName: name,
            comment: text,
            date: today,
            createdAt: now,
        };

        await setDoc(doc(db, "comments", name + today), innerDoc)
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

        //구조 묶어주기 
        div.append(h3);
        div.append(date);
        li.append(div);
        li.append(span);
        li.append(btn_del);
        Comment.prepend(li);
    }
});