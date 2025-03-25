"use client";
import {Link,useNavigate} from "react-router";
import { useAuth } from "/src/lib/auth-context"
import React, {createContext, useContext, useState} from "react";
import {ShoppingCart, Search, X, MessageSquare, Bell} from "lucide-react";


const AuthContext=createContext(null);

export default function Header() {
    const { user, logout } = useAuth()
    const [searchQuery, setSearchQuery] = useState("");
    const [showSearchResults, setShowSearchResults] = useState(false);
    const navigate = useNavigate();
    const handleLogout = () => {
        logout()
        navigate("/");
    }

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSearchResults(true);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setShowSearchResults(false);
  };

  return React.createElement(
    "header",
    { className: "bg-white shadow-sm" },
    React.createElement(
      "div",
      { className: "container mx-auto px-4 py-4" },
      React.createElement(
        "div",
        { className: "flex items-center justify-between" },
        React.createElement(
          Link,
          { to: "/", className: "flex items-center" },
          React.createElement("div", {
            className: "w-8 h-8 rounded-full bg-primary mr-2",
          }),
          React.createElement(
            "span",
            { className: "text-xl font-bold" },
            "art U"
          )
        ),

        // Search Bar
        React.createElement(
          "div",
          { className: "relative mx-4 flex-grow max-w-xl" },
          React.createElement(
            "form",
            { onSubmit: handleSearch, className: "relative" },
            React.createElement("input", {
              type: "text",
              placeholder: "이벤트, 사용자, 장소 검색...",
              className:
                "w-full py-2 pl-10 pr-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
              value: searchQuery,
              onChange: (e) => setSearchQuery(e.target.value),
            }),
            React.createElement(Search, {
              className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5",
            }),
            searchQuery &&
              React.createElement(
                "button",
                {
                  type: "button",
                  onClick: clearSearch,
                  className: "absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600",
                },
                React.createElement(X, { className: "w-4 h-4" })
              )
          ),

          // Search Results Dropdown
          showSearchResults &&
            searchQuery &&
            React.createElement(
              "div",
              { className: "absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-50" },
              React.createElement(
                "div",
                { className: "p-4" },
                React.createElement(
                  "div",
                  { className: "mb-4" },
                  React.createElement(
                    "h3",
                    { className: "text-sm font-semibold text-gray-500 mb-2" },
                    "이벤트"
                  ),
                  searchQuery &&
                    React.createElement(
                      "div",
                      { className: "space-y-2" },
                      React.createElement(
                        Link,
                        {
                          to: `/search?q=${encodeURIComponent(searchQuery)}&type=event`,
                          className: "block",
                        },
                        React.createElement(
                          "div",
                          { className: "flex items-center p-2 hover:bg-gray-50 rounded-lg" },
                          React.createElement(
                            "div",
                            {
                              className:
                                "w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-3",
                            },
                            React.createElement("span", {
                              className: "text-primary text-xs",
                            },
                            "공연")
                          ),
                          React.createElement(
                            "div",
                            null,
                            React.createElement(
                              "p",
                              { className: "text-sm font-medium" },
                              `${searchQuery} 관련 공연`
                            ),
                            React.createElement(
                              "p",
                              { className: "text-xs text-gray-500" },
                              "3월 15일 예술의전당"
                            )
                          )
                        )
                      ),
                      React.createElement(
                        Link,
                        {
                          to: `/search?q=${encodeURIComponent(searchQuery)}&type=event`,
                          className: "block",
                        },
                        React.createElement(
                          "div",
                          { className: "flex items-center p-2 hover:bg-gray-50 rounded-lg" },
                          React.createElement(
                            "div",
                            {
                              className:
                                "w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-3",
                            },
                            React.createElement("span", {
                              className: "text-primary text-xs",
                            },
                            "전시")
                          ),
                          React.createElement(
                            "div",
                            null,
                            React.createElement(
                              "p",
                              { className: "text-sm font-medium" },
                              `${searchQuery} 특별전`
                            ),
                            React.createElement(
                              "p",
                              { className: "text-xs text-gray-500" },
                              "4월 10일 국립현대미술관"
                            )
                          )
                        )
                      )
                    )
                ),

                React.createElement(
                  "div",
                  { className: "mb-4" },
                  React.createElement(
                    "h3",
                    { className: "text-sm font-semibold text-gray-500 mb-2" },
                    "사용자"
                  ),
                  searchQuery &&
                    React.createElement(
                      "div",
                      { className: "space-y-2" },
                      React.createElement(
                        Link,
                        {
                          to: `/search?q=${encodeURIComponent(searchQuery)}&type=user`,
                          className: "block",
                        },
                        React.createElement(
                          "div",
                          { className: "flex items-center p-2 hover:bg-gray-50 rounded-lg" },
                          React.createElement("div", {
                            className: "w-10 h-10 bg-gray-200 rounded-full mr-3",
                          }),
                          React.createElement(
                            "div",
                            null,
                            React.createElement(
                              "p",
                              { className: "text-sm font-medium" },
                              `${searchQuery}님`
                            ),
                            React.createElement(
                              "p",
                              { className: "text-xs text-gray-500" },
                              "아티스트"
                            )
                          )
                        )
                      ),
                      React.createElement(
                        Link,
                        {
                          to: `/search?q=${encodeURIComponent(searchQuery)}&type=user`,
                          className: "block",
                        },
                        React.createElement(
                          "div",
                          { className: "flex items-center p-2 hover:bg-gray-50 rounded-lg" },
                          React.createElement("div", {
                            className: "w-10 h-10 bg-gray-200 rounded-full mr-3",
                          }),
                          React.createElement(
                            "div",
                            null,
                            React.createElement(
                              "p",
                              { className: "text-sm font-medium" },
                              `${searchQuery}_official`
                            ),
                            React.createElement(
                              "p",
                              { className: "text-xs text-gray-500" },
                              "공연단체"
                            )
                          )
                        )
                      )
                    )
                ),

                React.createElement(
                  "div",
                  null,
                  React.createElement(
                    "h3",
                    { className: "text-sm font-semibold text-gray-500 mb-2" },
                    "장소"
                  ),
                  searchQuery &&
                    React.createElement(
                      "div",
                      { className: "space-y-2" },
                      React.createElement(
                        Link,
                        {
                          to: `/search?q=${encodeURIComponent(searchQuery)}&type=place`,
                          className: "block",
                        },
                        React.createElement(
                          "div",
                          { className: "flex items-center p-2 hover:bg-gray-50 rounded-lg" },
                          React.createElement(
                            "div",
                            {
                              className:
                                "w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-3",
                            },
                            React.createElement("span", {
                              className: "text-primary text-xs",
                            },
                            "장소")
                          ),
                          React.createElement(
                            "div",
                            null,
                            React.createElement(
                              "p",
                              { className: "text-sm font-medium" },
                              `${searchQuery} 아트센터`
                            ),
                            React.createElement(
                              "p",
                              { className: "text-xs text-gray-500" },
                              "서울 강남구"
                            )
                          )
                        )
                      ),
                      React.createElement(
                        Link,
                        {
                          to: `/search?q=${encodeURIComponent(searchQuery)}&type=place`,
                          className: "block",
                        },
                        React.createElement(
                          "div",
                          { className: "flex items-center p-2 hover:bg-gray-50 rounded-lg" },
                          React.createElement(
                            "div",
                            {
                              className:
                                "w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-3",
                            },
                            React.createElement("span", {
                              className: "text-primary text-xs",
                            },
                            "장소")
                          ),
                          React.createElement(
                            "div",
                            null,
                            React.createElement(
                              "p",
                              { className: "text-sm font-medium" },
                              `${searchQuery} 공연장`
                            ),
                            React.createElement(
                              "p",
                              { className: "text-xs text-gray-500" },
                              "서울 마포구"
                            )
                          )
                        )
                      )
                    )
                ),

                React.createElement(
                  "div",
                  { className: "mt-3 pt-3 border-t border-gray-100 text-center" },
                  React.createElement(
                    Link,
                    {
                      to: `/search?q=${encodeURIComponent(searchQuery)}`,
                      className: "text-sm text-primary hover:underline",
                    },
                    `"${searchQuery}" 검색결과 모두 보기`
                  )
                )
              )
            )
        ),

        React.createElement(
          "nav",
          null,
          React.createElement(
            "div",
            { className: "flex items-center space-x-4" },
            React.createElement(
              Link,
              { to: "/cart", className: "text-gray-700 hover:text-primary relative" },
              React.createElement(ShoppingCart, { className: "w-5 h-5" }),
              React.createElement(
                "span",
                {
                  id: "cart-count",
                  className:
                    "absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-4 h-4 flex items-center justify-center",
                },
                typeof window !== "undefined" && localStorage.getItem("cartItems")
                  ? JSON.parse(localStorage.getItem("cartItems") || "[]").length
                  : 0
              )
            ),
            user &&
              React.createElement(
                React.Fragment,
                null,
                React.createElement(
                  Link,
                  { to: "/messages", className: "text-gray-700 hover:text-primary relative" },
                  React.createElement(MessageSquare, { className: "w-5 h-5" }),
                  React.createElement(
                    "span",
                    {
                      id: "message-count",
                      className:
                        "absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center",
                    },
                    typeof window !== "undefined" && localStorage.getItem("unreadMessages")
                      ? JSON.parse(localStorage.getItem("unreadMessages") || "[]").length
                      : 2
                  )
                ),
                React.createElement(
                  Link,
                  { to: "/notifications", className: "text-gray-700 hover:text-primary relative" },
                  React.createElement(Bell, { className: "w-5 h-5" }),
                  React.createElement(
                    "span",
                    {
                      id: "notification-count",
                      className:
                        "absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center",
                    },
                    typeof window !== "undefined" && localStorage.getItem("unreadNotifications")
                      ? JSON.parse(localStorage.getItem("unreadNotifications") || "[]").length
                      : 3
                  )
                ),
                React.createElement(
                  "div",
                  { className: "relative group" },
                  React.createElement(
                    "button",
                    { className: "text-gray-700 hover:text-primary flex items-center" },
                    "게시물 작성",
                    React.createElement("svg", {
                      xmlns: "http://www.w3.org/2000/svg",
                      className: "h-4 w-4 ml-1",
                      fill: "none",
                      viewBox: "0 0 24 24",
                      stroke: "currentColor",
                    }),
                    React.createElement("path", {
                      strokeLinecap: "round",
                      strokeLinejoin: "round",
                      strokeWidth: 2,
                      d: "M19 9l-7 7-7-7",
                    })
                  ),
                  React.createElement(
                    "div",
                    {
                      className:
                        "absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-[50] invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300",
                    },
                    React.createElement(
                      Link,
                      {
                        to: "/posts/create",
                        className: "block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100",
                      },
                      "일반 게시물"
                    ),
                    React.createElement(
                      Link,
                      {
                        to: "/posts/create-booking",
                        className: "block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100",
                      },
                      "예매 게시물"
                    )
                  )
                ),
                React.createElement(
                  Link,
                  { to: "/mypage", className: "text-gray-700 hover:text-primary" },
                  "마이페이지"
                ),
                React.createElement(
                  "button",
                  { onClick: handleLogout, className: "text-gray-700 hover:text-primary" },
                  "로그아웃"
                )
              ),
            !user &&
              React.createElement(
                React.Fragment,
                null,
                React.createElement(
                  Link,
                  { to: "/login", className: "text-gray-700 hover:text-primary" },
                  "로그인"
                ),
                React.createElement(
                  Link,
                  { to: "/signup", className: "text-gray-700 hover:text-primary" },
                  "회원가입"
                )
              )
          )
        )
      )
    )
  );
}

