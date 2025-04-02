import React, { useState, useEffect } from "react";
import { Settings } from "lucide-react";
import { Link } from "react-router-dom";

import './mypageStyle.css';
import './mypageRefined.css';
import './widgetStyle.css';
import './reactive.css';

const widgetData = [
    { id: "widget1", type: "calander", size: "1x1", label: "캘린더" },
    { id: "widget2", type: "calander", size: "2x1", label: "캘린더" },
    { id: "widget3", type: "calander", size: "3x1", label: "캘린더" },
    { id: "widget4", type: "weather", size: "1x1", label: "날씨" },
    { id: "widget5", type: "weather", size: "2x1", label: "날씨" },
    { id: "widget6", type: "weather", size: "3x1", label: "날씨" },
    { id: "widget7", type: "memo", size: "1x1", label: "메모" },
    { id: "widget8", type: "memo", size: "2x1", label: "메모" },
    { id: "widget9", type: "memo", size: "3x1", label: "메모" },
    { id: "widget10", type: "info", size: "1x1", label: "소개" },
    { id: "widget11", type: "info", size: "2x1", label: "소개" },
    { id: "widget12", type: "info", size: "3x1", label: "소개" },
    { id: "widget13", type: "bookmark", size: "1x1", label: "북마크" },
    { id: "widget14", type: "bookmark", size: "2x1", label: "북마크" },
    { id: "widget15", type: "bookmark", size: "3x1", label: "북마크" },
    { id: "widget16", type: "display", size: "1x1", label: "전시대" },
    { id: "widget17", type: "display", size: "2x1", label: "전시대" },
    { id: "widget18", type: "display", size: "3x1", label: "전시대" },
    { id: "widget19", type: "image", size: "1x1", label: "이미지" },
    { id: "widget20", type: "image", size: "2x1", label: "이미지" },
    { id: "widget21", type: "image", size: "3x1", label: "이미지" },
    { id: "widget22", type: "countdown", size: "1x1", label: "카운트다운" },
    { id: "widget23", type: "countdown", size: "2x1", label: "카운트다운" },
    { id: "widget24", type: "countdown", size: "3x1", label: "카운트다운" },
    { id: "widget25", type: "graph", size: "1x1", label: "그래프" },
    { id: "widget26", type: "graph", size: "2x1", label: "그래프" },
    { id: "widget27", type: "graph", size: "3x1", label: "그래프" },
];

const Mypage = () => {
    const [widgets, setWidgets] = useState(widgetData);
    const [draggingWidget, setDraggingWidget] = useState(null);

    const userName = "사용자님";
    const userEmail = "user@example.com";
    const userIntroduction = "자기소개를 작성해보세요.";
    const stats = { posts: 1234, followers: 5678, following: 910 };

    useEffect(() => {
        document.title = `${userName}의 페이지`;
    }, [userName]);

    const onDragStart = (e, widgetId) => {
        setDraggingWidget(widgetId);
        e.dataTransfer.effectAllowed = "move";
        e.target.classList.add("dragging");
    };

    const onDragEnd = (e) => {
        e.target.classList.remove("dragging");
        setDraggingWidget(null);
    };

    const onDragOver = (e) => {
        e.preventDefault();
        e.currentTarget.classList.add("drag-over");
    };

    const onDrop = (e, targetIndex) => {
        e.preventDefault();
        const draggedWidget = widgets.find((widget) => widget.id === draggingWidget);
        if (!draggedWidget) return;

        const updatedWidgets = widgets.filter((widget) => widget.id !== draggingWidget);
        updatedWidgets.splice(targetIndex, 0, draggedWidget);
        setWidgets(updatedWidgets);

        e.currentTarget.classList.remove("drag-over");
        setDraggingWidget(null);
    };

    const renderWidgetContent = (widget) => {
        switch (widget.type) {
            case "calander":
                return (
                    <>
                        <ul className="calander-main">
                            <li><span>FRI</span></li>
                            <li><h5>21</h5></li>
                            <li><span>캘린더</span></li>
                        </ul>
                        {widget.size !== "1x1" && (
                            <ul className="calander-sub">
                                {Array(4).fill(null).map((_, i) => (
                                    <li key={i} className="calander-sub-item">
                                        <span>금요일 3월 21일</span>
                                        <span>
                                        <div></div>
                                        <a href="">이벤트</a>
                                    </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </>
                );
            case "weather":
                return (
                    <>
                        <div className="weather-sun"></div>
                        <div className="weather-main-container">
                            <ul className="weather-main">
                                <li>
                                    <span>15</span><span>&deg;C</span>
                                </li>
                                {widget.size !== "1x1" && <li><span>맑음</span></li>}
                            </ul>
                            <ul className="weather-sub">
                                <li>H:<span>20</span>&deg;<span>C</span></li>
                                <li>L:<span>15</span>&deg;<span>C</span></li>
                            </ul>
                            {widget.size !== "1x1" && (
                                <div className="weather-ex">
                                    <span>서울특별시</span>
                                </div>
                            )}
                        </div>
                    </>
                );
            case "memo":
                return (
                    <div className="memo-container">
                        <ul className="memo-main">
                            <li><h5>메모</h5></li>
                            <li><p>내용</p></li>
                        </ul>
                    </div>
                );
            case "info":
                return (
                    <div className="info-container">
                        <ul className="info-main">
                            <li><h5>소개</h5></li>
                            <li><p>내용</p></li>
                        </ul>
                    </div>
                );
            case "bookmark":
                return (
                    <div className="bookmark-container">
                        <ul className="bookmark-main">
                            {Array(widget.size === "2x1" ? 2 : widget.size === "3x1" ? 3 : 1).fill(null).map((_, i) => (
                                <li key={i} className="bookmark-item">
                                    <span>콘서트</span>
                                    <span>콘서트 설명</span>
                                </li>
                            ))}
                        </ul>
                        {widget.size === "1x1" && <div className="bookmark-sub"></div>}
                    </div>
                );
            case "display":
                return (
                    <div className="display-container">
                        <ul className="display-main">
                            {Array(widget.size === "1x1" ? 1 : widget.size === "2x1" ? 6 : 16).fill(null).map((_, i) => (
                                <li key={i} className="display-item">
                                    <img src="/placeholder.svg" alt="" />
                                </li>
                            ))}
                        </ul>
                    </div>
                );
            case "image":
                return (
                    <div className="image-container">
                        <img src="/placeholder.svg" alt="" />
                    </div>
                );
            case "countdown":
                return (
                    <div className="countdown-container">
                        <ul className="countdown-main">
                            <li><span>D</span><span>-</span><span>12</span></li>
                            <li><a href=""><span>콘서트</span></a></li>
                        </ul>
                    </div>
                );
            case "graph":
                return (
                    <div className="graph-container">
                        <canvas></canvas>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div id="mypage-body">
            {/* Header */}
            <header>
                <ul>
                    <li><h1>art U</h1></li>
                    <li><img src="/placeholder.svg" alt="profile_image" /></li>
                    <li><span>{userName}</span></li>
                </ul>
            </header>

            {/* Aside */}
            <aside>
                <div id="nav-container">
                    <section>
                        <h2>{userName}님의 페이지</h2>
                        <article className="flex items-center">
                            <Link to="/settings" className="mr-2 text-lg text-blue-500 hover:underline">설정</Link>
                            <Settings className="inline-block mr-2 w-5" />
                        </article>
                    </section>
                </div>
            </aside>

            {/* Main Content */}
            <div id="main-container">
                <section>
                    <div id="profile-container">
                        <img src="/placeholder.svg" alt="profile_image" />
                        <ul>
                            <li><h3>{userName}</h3></li>
                            <li><p>{userEmail}</p></li>
                            <li><p><a href="/profile/edit">프로필 편집하기</a></p></li>
                        </ul>
                        <div id="profile-number-container">
                            <ul>
                                <li><div className="profile-number"><span>{stats.posts.toLocaleString()}</span><a href="">게시물</a></div></li>
                                <li><div className="profile-number"><span>{stats.followers.toLocaleString()}</span><a href="">팔로워</a></div></li>
                                <li><div className="profile-number"><span>{stats.following.toLocaleString()}</span><a href="">팔로잉</a></div></li>
                            </ul>
                        </div>
                    </div>
                    <article>
                        <p>{userIntroduction?.trim() || "자기소개가 없습니다. 프로필을 수정하여 자기소개를 작성해보세요."}</p>
                    </article>
                </section>
            </div>

            {/* Widgets */}
            <div id="widget-container">
                <section onDragOver={onDragOver} onDrop={onDrop} onDragEnd={onDragEnd}>
                    {widgets.map((widget, index) => (
                        <article
                            key={widget.id}
                            id={widget.id}
                            className={`widget size-${widget.size} ${widget.type} ${
                                widget.size === "1x1" ? "one-one" :
                                    widget.size === "2x1" ? "two-one" :
                                        widget.size === "3x1" ? "three-one" : ""
                            }`}
                            draggable={true}
                            onDragStart={(e) => onDragStart(e, widget.id)}
                        >
                            <div className={`${widget.type}-container`}>
                                {renderWidgetContent(widget)}
                            </div>
                        </article>
                    ))}
                </section>
            </div>

            {/* Footer */}
            <footer>
                <p>&copy; 2025 Art U</p>
                <address>
                    <ul>
                        <li><a href="mailto:user@example.com"><img src="/placeholder.svg" alt="email" /></a></li>
                        <li><a href="https://www.youtube.com"><img src="/placeholder.svg" alt="youtube" /></a></li>
                        <li><a href="https://www.instagram.com"><img src="/placeholder.svg" alt="instagram" /></a></li>
                    </ul>
                </address>
            </footer>
        </div>
    );
};

export default Mypage;