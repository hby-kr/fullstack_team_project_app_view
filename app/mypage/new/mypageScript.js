document.addEventListener("DOMContentLoaded", () => {
    // --- 프로필 정보 업데이트 ---
    const userName = "사용자님";
    const userEmail = "user@example.com";
    const userIntroduction = "자기소개를 작성해보세요.";

    // 프로필 동적 업데이트
    document.querySelectorAll("header ul li span").forEach((el) => {
        el.textContent = userName;
    });

    document.querySelector("#profile-container h3").textContent = userName;
    document.querySelector("#profile-container p").textContent = userEmail;

    const bioSection = document.querySelector(
        "#main-container section article p"
    );
    if (userIntroduction && userIntroduction.trim() !== "") {
        bioSection.textContent = userIntroduction;
    }

    // --- 프로필 번호 동적 업데이트 ---
    const stats = {
        posts: 1234,
        followers: 5678,
        following: 910,
    };

    const profileNumberElements = document.querySelectorAll(
        ".profile-number span"
    );
    profileNumberElements[0].textContent = `${stats.posts.toLocaleString()}`;
    profileNumberElements[1].textContent = `${stats.followers.toLocaleString()}`;
    profileNumberElements[2].textContent = `${stats.following.toLocaleString()}`;

    // --- 네비게이션 동적 생성 ---
    const navSection = document.querySelector("#nav-container section h2");
    navSection.innerHTML = "사용자님의 페이지";

    // --- 주소 또는 푸터 내 링크 변경 ---
    const footerLinks = [
        { href: "mailto:user@example.com", text: "이메일" },
        { href: "https://www.youtube.com", text: "유튜브" },
        { href: "https://www.instagram.com", text: "인스타그램" },
    ];

    const footerList = document
        .querySelector("footer address ul")
        .querySelectorAll("li");

    footerLinks.forEach((link, index) => {
        const anchor = footerList[index].querySelector("a");
        anchor.href = link.href;
        anchor.textContent = link.text;
    });
});