"use client"

import React from "react"

import {useState} from "react"
import {Link, useNavigate} from "react-router"

export default function SignupPage() {


   const [user, setUser] = useState({
      id: '',
      pw: '',
      pwAgain: ''
   });


   const [error, setError] = useState("")
   const navigate = useNavigate()

   const handleSubmit = async (e) => {
      e.preventDefault()
      setError("")

      try {
         // 실제로는 API 호출을 통해 회원가입을 처리해야 함
         // 여기서는 간단한 예시로 구현

         // 회원가입 성공 가정
         navigate("/login?registered=true")
      } catch (error) {
         setError("회원가입에 실패했습니다. 다시 시도해주세요.")
      }
   }

   // 인풋 태그 둘 제어
   function inputHandler(e) {
      const {name, value} = e.target;
      setUser(
         (prevUser) => ({...prevUser, [name]: value})
         // 기존 값을 스프레드_펴바르고, name과 일치하는 필드명이 있으면, 그 값만 덮어쓰기한다.
      )
   }

   return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
         <div className="max-w-md w-full space-y-8">
            <div>
               <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">회원가입</h2>
               <p className="mt-2 text-center text-sm text-gray-600">
                  이미 계정이 있으신가요?{" "}
                  <Link to="/login" className="font-medium text-primary hover:text-primary/80">
                     로그인
                  </Link>
               </p>
            </div>


            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
               <div className="rounded-md shadow-sm -space-y-px">
                  <div>
                     <label htmlFor="id" className="sr-only"> 아이디 </label>
                     <input
                        id="id" name="id" type="text" required placeholder="아이디" value={user.id} onChange={inputHandler}
                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"/>
                  </div>
                  <div><label htmlFor="email" className="sr-only">이메일</label>
                     <input id="email" name="email" type="email" required placeholder="이메일" value={user.email} onChange={inputHandler}
                            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"/>
                  </div>
                  <div><label htmlFor="password" className="sr-only">비밀번호</label>
                     <input id="password" name="pw" type="password" required placeholder="비밀번호 (6자 이상)" value={user.pw}  onChange={inputHandler}
                            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"/>
                  </div>
                  <div><label htmlFor="pwAgain" className="sr-only">비밀번호 확인</label>
                     <input id="pwAgain" name="pwAgain" type="password" required placeholder="비밀번호 확인"
                            value={user.pwAgain} onChange={inputHandler}
                            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"/>
                  </div>

               </div>

               {error && <div className="text-red-500 text-sm text-center">{error}</div>}

               <div>
                  <button
                     type="submit"
                     className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                     회원가입
                  </button>
               </div>
            </form>
         </div>
      </div>
   )
}

