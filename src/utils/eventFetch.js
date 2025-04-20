// 리액트 컴포넌트는 대문자로 시작해야 리액트가 컴포넌트로 인식
// 컴포넌트 말고 일반 유틸은 함수니까, 보통 자바스크립트 함수 네이밍 룰을 따른다.
// ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ
const serverUrl = "http://localhost:4775";


export async function loadeventForMain(categoryId, pageSize) {

   const URL = `${serverUrl}/event/main/cate/${categoryId}/${pageSize}`; // 요청을 보낼 URL. (카테고리 번호와 페이지 크기를 포함)

   const response = await fetch(URL); // 해당 URL로 GET 요청을 보냄
   if (!response.ok) throw new Error(response.status + ""); // 응답 상태가 실패일 경우 에러를 발생시킴

   return await response.json();  // 응답 본문을 JSON 형식으로 파싱해서 반환
};


// 이 함수는 특정 카테고리에 속한 이벤트 목록을 서버에서 받아옴
export async function loadeventsByCtgr(categoryId) {
   const URL = `${serverUrl}/event/cate/${categoryId}`; // 요청을 보낼 URL (카테고리 번호 포함)

   const response = await fetch(URL); // GET 요청 보냄
   if (!response.ok) throw new Error(response.status + ""); // 응답 실패 시 에러 발생

   return await response.json(); // 응답 데이터를 JSON으로 파싱해서 반환
}

// 이벤트 세부 페이지
export async function loadEventOne(eventId) {
   const URL = `${serverUrl}/event/${eventId}`; // 요청을 보낼 URL (이벤트 ID 포함)

   const response = await fetch(URL); // GET 요청 보냄
   if (!response.ok) throw new Error(response.status + ""); // 응답 실패 시 에러 발생

   return await response.json(); // 응답 데이터를 JSON으로 파싱해서 반환
}