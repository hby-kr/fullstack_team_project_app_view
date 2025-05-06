import React, {useEffect} from "react"
import { useState } from "react"
import {Link, useNavigate} from "react-router"
import { useAuth } from "/src/lib/auth-context"
import {useQuery} from "@tanstack/react-query";
import {loadLogin} from "../../../utils/UserFetch.js";
import {GoogleLogin} from "@react-oauth/google";
import {jwtDecode} from "jwt-decode";

export default function LoginPage() {

  const navigate = useNavigate();
  const [loginUser, setLoginUser] = useAuth()

  const [user, setUser] = useState({
    id: '',
    pw: ''
  });

  const [googleUser, setGoogleUser] = useState(null);
  useEffect(() => {
    if (googleUser) {
      googleLoginQuery.refetch(); // googleLoginQuery를 재실행.
    }
  }, [googleUser]); //마운트+googleUser가 바뀔때 useEffect 실행



  const loginQuery = useQuery({
    // useQuery로 로그인 사용자 데이터를 서버에서 가져오고, 그 데이터를 상태로 설정하고 페이지를 이동하는 등의 작업을 하는 중임.
    queryFn: async () => {
      try {
        const loginUser = await loadLogin(user);
        setLoginUser(() => loginUser);
        navigate("/");
        return loginUser;
      } catch (e) {
        console.log(e);
        throw new Error("아이디와 비밀번호를 확인하세요!");
      }
    },
    queryKey: ["loginUser", user.id],
    retry: 1,
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
    enabled: false, // 수동!!
  })


  const googleLoginQuery = useQuery({
    queryFn: async () => {
      const resp = await loadGoogleLogin(googleUser);
      //404 or 409 or 200 셋 중 하나의 결과(와 데이터)가 옴

      if (resp.ok) { //200이면
        alert("소셜 로그인 성공");
        const {jwt, user} = await resp.json();
        setLoginUser(() => user);
        localStorage.setItem("jwt", jwt);
        navigate("/");
        return user;

      } else if (resp.status === 404) { // 404 계정정보 없음

        navigate("/oauth/signup", {
          state: {
            error: "회원가입 후 로그인 하세요.",
            user: googleUser,
          }
        });
        throw new Error("회원가입 후 로그인 하세요.")

      } else if (resp.status === 409) { // 409 로그인 정보는 있는데, 접근이 다르다.
        const {user} = await resp.json();
        throw new Error(user.oauth + " 로 로그인 하세요.");
      }
    },
    queryKey: ["loginUser", user.id],
    retry: 1,
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
    enabled: false,
  })



  // 인풋 태그 둘 제어
  function inputHandler(e) {
    const {name, value} = e.target;
    setUser(
       (prevUser) => ({...prevUser, [name]: value})
       // 기존 값을 스프레드_펴바르고, name과 일치하는 필드명이 있으면, 그 값만 덮어쓰기한다.
    )
  }

  // 로그인 제출 제어
  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log(user, "로그인 시도");
    loginQuery.refetch();
  }


    return (
       <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
         <div className="max-w-md w-full space-y-8">

           <div>
             <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">로그인</h2>
             <p className="mt-2 text-center text-sm text-gray-600">
               아직 계정이 없으신가요?{" "}
               <Link to="/signup" className="font-medium text-primary hover:text-primary/80">
                 회원가입
               </Link>
             </p>
           </div>

           <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
             <div className="rounded-md shadow-sm -space-y-px">

               <div>
                 <label htmlFor="id" className="sr-only">이메일</label>
                 <input
                    id="id"
                    name="id"
                    type="text"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                    placeholder="아이디"
                    value={user.id}
                    onChange={inputHandler}
                 />
               </div>

               <div>
                 <label htmlFor="pw" className="sr-only">비밀번호</label>
                 <input
                    id="pw"
                    name="pw"
                    type="password"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                    placeholder="비밀번호"
                    value={user.pw}
                    onChange={inputHandler}
                 />
               </div>
             </div>

             {loginQuery.error && <p>{loginQuery.error.message}</p>}

             <div className="flex items-center justify-between">
               <div className="flex items-center">
                 <input id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" />
                 <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                   로그인 상태 유지
                 </label>
               </div>

               <div className="text-sm">
                 <a href="#" className="font-medium text-primary hover:text-primary/80">
                   비밀번호를 잊으셨나요?
                 </a>
               </div>
             </div>

             <div>
               <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary" >
                 로그인
               </button>
             </div>
             <GoogleLogin onSuccess={(credentialResponse) => { // 구글 소셜로그인 성공하면,
               const user = jwtDecode(credentialResponse.credential);
               console.log(user);
               setGoogleUser(() => user); // GoogleUser라는 상태를 변경 -> useEffect를 써서 함수를 실행하도록 시킴
               //googleLoginQuery.refetch();
             }}/>
           </form>

         </div>
       </div>
    )
  }

