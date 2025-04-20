"use client"

import React from "react"

import { useState } from "react"
import {Link} from "react-router"
import { ArrowLeft, Send } from "lucide-react"
import Header from "/src/components/header"

export default function ContactPage() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [subject, setSubject] = useState("")
    const [message, setMessage] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)

        // 실제 구현에서는 API 호출로 데이터를 전송합니다
        // 여기서는 간단히 제출 성공을 시뮬레이션합니다
        await new Promise((resolve) => setTimeout(resolve, 1000))

        setIsSubmitted(true)
        setIsSubmitting(false)

        // 폼 초기화
        setName("")
        setEmail("")
        setSubject("")
        setMessage("")
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">


            <main className="flex-grow container mx-auto px-4 py-8">
                <div className="max-w-3xl mx-auto">
                    <Link to="/public" className="inline-flex items-center text-gray-600 hover:text-primary mb-6">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        <span>홈으로 돌아가기</span>
                    </Link>

                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h1 className="text-2xl font-bold mb-6">문의하기</h1>

                        {isSubmitted ? (
                            <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-md mb-6">
                                <p className="font-medium">문의가 성공적으로 접수되었습니다!</p>
                                <p className="mt-2">빠른 시일 내에 답변 드리겠습니다. 감사합니다.</p>
                                <button
                                    onClick={() => setIsSubmitted(false)}
                                    className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
                                >
                                    새 문의하기
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
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

                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                            이메일
                                        </label>
                                        <input
                                            id="email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                            placeholder="이메일을 입력하세요"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                                        제목
                                    </label>
                                    <input
                                        id="subject"
                                        type="text"
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                        placeholder="문의 제목을 입력하세요"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                                        문의 내용
                                    </label>
                                    <textarea
                                        id="message"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        rows={6}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                        placeholder="문의 내용을 상세히 입력해주세요"
                                        required
                                    />
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-70"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            "제출 중..."
                                        ) : (
                                            <>
                                                <Send className="w-4 h-4 mr-2" />
                                                문의하기
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        )}

                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <h2 className="text-lg font-medium mb-4">다른 문의 방법</h2>
                            <div className="space-y-4">
                                <div>
                                    <p className="font-medium">이메일</p>
                                    <p className="text-gray-600">support@artu.com</p>
                                </div>
                                <div>
                                    <p className="font-medium">전화</p>
                                    <p className="text-gray-600">02-123-4567 (평일 10:00 - 18:00)</p>
                                </div>
                                <div>
                                    <p className="font-medium">주소</p>
                                    <p className="text-gray-600">서울특별시 강남구 아트로 123 아트유빌딩 5층</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="bg-gray-800 text-white py-6">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-gray-400">&copy; 2024 art U. All rights reserved.</p>
                </div>
            </footer>
        </div>
    )
}

