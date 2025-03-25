"use client"

import { useState, useEffect } from "react"
import {Link} from "react-router"
import Header from "/src/components/header"

export default function PostListPage() {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    // 로컬 스토리지에서 게시물 불러오기
    const storedPosts = JSON.parse(localStorage.getItem("posts") || "[]")
    setPosts(storedPosts)
  }, [])

  if (posts.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-xl font-semibold mb-4">등록된 게시물이 없습니다.</p>
          <Link to="/create-post" className="text-primary hover:underline">
            게시물 등록하기
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">게시물 목록</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link
              to={`/detail/${post.id}`}
              key={post.id}
              className="border rounded-lg overflow-hidden shadow-sm bg-white hover:shadow-md"
            >
              <img src={post.images || ""} alt={post.title} className="w-full h-40 object-cover" />
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                <p className="text-sm text-gray-600">카테고리: {post.category}</p>
                <p className="text-sm text-gray-600">작성자: {post.userName}</p>
                <p className="text-sm text-gray-600">작성일: {post.date}</p>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}

