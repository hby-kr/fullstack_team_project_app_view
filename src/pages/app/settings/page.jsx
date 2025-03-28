"use client";

import {Link} from "react-router"
import { ArrowLeft } from "lucide-react"


export default function SettingsPage() {
    return (
        <div className="min-h-screen bg-gray-50">

            <div className="max-w-3xl mx-auto py-8">

                <div className="flex items-center mb-6">
                    <Link to="/mypage" className="mr-4 p-2 rounded-full hover:bg-gray-100">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <h1 className="text-2xl font-bold">설정</h1>
                </div>


                {/* 설정 항목들 */}
                <div className="space-y-8">
                    {/* 디스플레이 설정 */}
                    <section className="bg-white p-6 shadow-sm rounded-lg">
                        <h2 className="text-lg font-semibold mb-4 text-gray-800">디스플레이 설정</h2>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-700">라이트 모드</span>
                            <input type="radio" name="display" id="light-mode" className="w-5 h-5" />
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                            <span className="text-gray-700">다크 모드</span>
                            <input type="radio" name="display" id="dark-mode" className="w-5 h-5" />
                        </div>
                    </section>

                    {/* 알림/소리 설정 */}
                    <section className="bg-white p-6 shadow-sm rounded-lg">
                        <h2 className="text-lg font-semibold mb-4 text-gray-800">알림/소리 설정</h2>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-700">메세지 알림</span>
                            <input type="checkbox" id="message-alert" className="w-5 h-5" />
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                            <span className="text-gray-700">소리</span>
                            <input type="checkbox" id="sound" className="w-5 h-5" />
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                            <span className="text-gray-700">진동</span>
                            <input type="checkbox" id="vibration" className="w-5 h-5" />
                        </div>

                        <div className="mt-6">
                            <label htmlFor="alert-display" className="block text-sm font-medium text-gray-800 mb-2">
                                알람 표시
                            </label>
                            <select
                                id="alert-display"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                <option value="name-message">이름 + 메세지</option>
                                <option value="name-only">이름</option>
                                <option value="hide">표시 안 함</option>
                            </select>
                        </div>
                    </section>

                    {/* 언어 설정 */}
                    <section className="bg-white p-6 shadow-sm rounded-lg">
                        <h2 className="text-lg font-semibold mb-4 text-gray-800">언어 설정</h2>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-700">한국어 (시스템 기본 언어)</span>
                            <input type="radio" name="language" id="korean" className="w-5 h-5" />
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                            <span className="text-gray-700">영어</span>
                            <input type="radio" name="language" id="english" className="w-5 h-5" />
                        </div>
                    </section>
                </div>

                {/* 뒤로 가기 버튼 */}
                <footer className="mt-8 px-4">
                    <Link to="/mypage" className="px-4 py-2 text-primary border border-primary rounded-md hover:bg-primary/10">
                        뒤로 가기
                    </Link>
                </footer>
            </div>
        </div>
    );
}

