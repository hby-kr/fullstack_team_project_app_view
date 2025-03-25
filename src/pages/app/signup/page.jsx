"use client";

import { useState } from "react";
//import { useRouter } from "next/navigation";
import {Link, useNavigate} from "react-router"
import { useAuth } from "/src/lib/auth-context";
import { Eye, EyeOff } from "lucide-react";

export default function SignupPage() {
  //const router = useRouter();
  const navigate = useNavigate();
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isVerifyingPhone, setIsVerifyingPhone] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleVerifyPhone = () => {
    const phoneRegex = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/;
    if (!phoneRegex.test(phoneNumber)) {
      setError("유효한 휴대폰 번호를 입력해주세요. (예: 010-1234-5678)");
      return;
    }

    setError("");
    setIsVerifyingPhone(true);
    alert("인증번호가 발송되었습니다. (데모용: 1234)");
  };

  const handleConfirmVerification = () => {
    if (verificationCode === "1234") {
      setIsVerifyingPhone(false);
      setIsPhoneVerified(true);
      alert("휴대폰 번호가 인증되었습니다.");
    } else {
      alert("인증번호가 일치하지 않습니다.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (!isPhoneVerified) {
      setError("휴대폰 번호 인증이 필요합니다.");
      return;
    }

    setIsLoading(true);

    try {
      await register(name, email, password);

      localStorage.setItem("user_phone", phoneNumber);

      navigate("/");
    } catch (err) {
      setError("회원가입에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-primary mr-2"></div>
              <span className="text-xl font-bold">art U</span>
            </Link>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow p-8">
          <h1 className="text-2xl font-bold text-center mb-6">회원가입</h1>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 text-sm">{error}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                이름
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="이름을 입력하세요"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                이메일
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="이메일 주소를 입력하세요"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                휴대폰 번호
              </label>
              <div className="flex space-x-2">
                <input
                  id="phoneNumber"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className={`flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${isPhoneVerified ? "bg-gray-100" : ""}`}
                  placeholder="010-0000-0000"
                  required
                  disabled={isPhoneVerified}
                />
                <button
                  type="button"
                  onClick={handleVerifyPhone}
                  className={`px-3 py-2 rounded-md ${
                    isPhoneVerified
                      ? "bg-green-100 text-green-700 cursor-default"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                  disabled={isPhoneVerified}
                >
                  {isPhoneVerified ? "인증완료" : "인증하기"}
                </button>
              </div>
              {isVerifyingPhone && (
                <div className="mt-2 flex space-x-2">
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="인증번호 입력"
                  />
                  <button
                    type="button"
                    onClick={handleConfirmVerification}
                    className="px-3 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                  >
                    확인
                  </button>
                </div>
              )}
              <p className="mt-1 text-xs text-gray-500">
                {isPhoneVerified ? "휴대폰 번호가 인증되었습니다." : "본인 확인을 위해 휴대폰 번호 인증이 필요합니다."}
              </p>
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                비밀번호
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="비밀번호를 입력하세요"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500">비밀번호는 최소 6자 이상이어야 합니다</p>
            </div>

            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                비밀번호 확인
              </label>
              <input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="비밀번호를 다시 입력하세요"
                required
              />
            </div>

            <button
              type="submit"
              className={`w-full py-2 px-4 rounded-md bg-primary text-primary-foreground font-medium ${
                isLoading ? "opacity-70 cursor-not-allowed" : "hover:bg-primary/90"
              }`}
              disabled={isLoading || !isPhoneVerified}
            >
              {isLoading ? "가입 중..." : "회원가입"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              이미 계정이 있으신가요?{" "}
              <Link to="/login" className="text-primary hover:underline">
                로그인
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

