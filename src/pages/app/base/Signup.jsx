"use client"

import React from "react"

import { useState } from "react"
import {Link, useNavigate} from "react-router"
import DaumPostcode from "react-daum-postcode"


export default function SignupPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()
  const [address, setAddress] = useState("")
  const [zonecode, setZonecode] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const themeObj = {
    bgColor: '#FFFFFF',
    pageBgColor: '#FFFFFF',
    postcodeTextColor: '#C05850',
    emphTextColor: '#222222',
  };

  const postCodeStyle = {
    width: '360px',
    height: '480px',
  };

  const completeHandler = (data) => {
    const { address, zonecode } = data;
    setZonecode(zonecode);
    setAddress(address);
  };

  const toggleHandler = () => {
    setIsOpen((prevOpenState) => !prevOpenState);
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (!email || !password || !confirmPassword) {
      setError("모든 필드를 입력해주세요.")
      return
    }

    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.")
      return
    }

    if (password.length < 6) {
      setError("비밀번호는 최소 6자 이상이어야 합니다.")
      return
    }

    try {
      // 실제로는 API 호출을 통해 회원가입을 처리해야 함
      // 여기서는 간단한 예시로 구현

      // 회원가입 성공 가정
      navigate("/login?registered=true")
    } catch (error) {
      setError("회원가입에 실패했습니다. 다시 시도해주세요.")
    }
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
          {isOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 bg-opacity-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-[400px] max-h-[90vh] overflow-auto relative">
                  <button
                      className="absolute top-2 right-2 text-gray-500 hover:text-black"
                      onClick={toggleHandler}
                  >
                    ✕
                  </button>

                  <DaumPostcode
                      theme={themeObj}
                      style={postCodeStyle}
                      onComplete={completeHandler}
                      onClose={(state) => {
                        if (state === 'FORCE_CLOSE') {
                          setIsOpen(false);
                        } else if (state === 'COMPLETE_CLOSE') {
                          setIsOpen(false);
                        }
                      }}
                  />
                </div>
              </div>
          )}
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  이메일
                </label>
                <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                    placeholder="이메일"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="flex">
                <label htmlFor="address" className="sr-only">
                  주소
                </label>
                <input
                    id="address"
                    name="address"
                    type="text"
                    required
                    className="appearance-none rounded-none relative  px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                    placeholder="주소"
                    value={address}
                    readOnly={true}
                />
                <input
                    id="zonecode"
                    name="zonecode"
                    type="text"
                    required
                    className="appearance-none rounded-none relative  px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                    placeholder="지번"
                    value={zonecode}
                    readOnly={true}

                />
                <button
                    onClick={toggleHandler}
                    type="button"
                    className="group relative  flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  주소 찾기
                </button>
              </div>
              <div>
                <label htmlFor="detail-address" className="sr-only">
                  비밀번호
                </label>
                <input
                    id="detail-address"
                    name="detailAddress"
                    type="text"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                    placeholder="상세주소"
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  비밀번호
                </label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                    placeholder="비밀번호 (6자 이상)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="confirm-password" className="sr-only">
                  비밀번호 확인
                </label>
                <input
                    id="confirm-password"
                    name="confirm-password"
                    type="password"
                    autoComplete="new-password"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                    placeholder="비밀번호 확인"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            {error && <div className="text-red-500 text-sm text-center">{error}</div>}

            <div>
              <button
                  type="submit"
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                회원가입
              </button>
            </div>
          </form>
        </div>
      </div>
  )
}

