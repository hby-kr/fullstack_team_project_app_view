const serverUrl        = "http://localhost:4775";
const LOGIN_URL        = `${serverUrl}/user/jwt/login.do`;


// const LOGIN_URL        = `${serverUrl}/user/jwt/login.do`;
// permitAll에서 로그인을 시도하는 것.
export async function loadLogin(loginUser) {
   // 매개변수 loginUser는 사용자가 입력한 아이디,비번. 그것을 비동기로 서버에 그 정보를 보내는 것.

   const response = await fetch(LOGIN_URL, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(loginUser) //  객체를 JSON 문자열로 바꾸는 작업. (보내기전에 작업)
   });

   // 오류일 때 여기서 차단 오류 띄우기.
   if (!response.ok) {
      console.log(response.statusText)
      throw new Error(response.status + "");
   }
   // 성공하면 위를 지나 여기에 도착
   // LoginDto를 서버에서 보내고 있는데, 필드가 두 개임.(jwt user) // user정보 너무 많이 주는데???
   const {jwt, user} = await response.json();
   console.log(jwt, user)

   // jwt있으면, localStorage에 저장시켜서 로그인
   if (jwt) {
      localStorage.setItem("jwt", jwt);
   }

   return user; // 유저정보 보내서 화면 상단에 정보 띄우려고 반환시키는 것.
}
