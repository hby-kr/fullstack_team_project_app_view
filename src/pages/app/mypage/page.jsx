import React, {useState, useEffect} from "react";
import {Settings} from "lucide-react";
import {useNavigate, Link} from "react-router-dom";

import './mypageStyle.css';
import './mypageRefined.css';
import './widgetStyle.css';
import './reactive.css';

import { widgetData } from "../widget/widgetData.js";
import { renderWidgetContent } from "../widget/widgetRenderer";

const Mypage = () => {
    const [widgets, setWidgets] = useState(widgetData);
    const [draggingWidget, setDraggingWidget] = useState(null);

    const userName = "사용자님";
    const userEmail = "user@example.com";
    const userIntroduction = "자기소개를 작성해보세요.";
    const stats = {posts: 1234, followers: 5678, following: 910};

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

    const [contextMenu, setContextMenu] = useState({visible: false, x: 0, y: 0, widgetId: null});

    const handleContextMenu = (e, widgetId) => {
        e.preventDefault();
        setContextMenu({visible: true, x: e.pageX, y: e.pageY, widgetId});
    };

    const handleCloseContextMenu = () => {
        setContextMenu({...contextMenu, visible: false});
    };

    useEffect(() => {
        document.addEventListener("click", handleCloseContextMenu);
        return () => document.removeEventListener("click", handleCloseContextMenu);
    }, [contextMenu]);

    const navigate = useNavigate();

    return (
        <div id="mypage-body">
            {/* Header */}
            <header>
                <ul>
                    <li><h1>art U</h1></li>
                    <li><img src="/placeholder.svg" alt="profile_image"/></li>
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
                            <Settings className="inline-block mr-2 w-5"/>
                        </article>
                    </section>
                </div>
            </aside>

            {/* Main Content */}
            <div id="main-container">
                <section>
                    <div id="profile-container">
                        <img src="/placeholder.svg" alt="profile_image"/>
                        <ul>
                            <li><h3>{userName}</h3></li>
                            <li><p>{userEmail}</p></li>
                            <li><p><a href="/profile/edit">프로필 편집하기</a></p></li>
                        </ul>
                        <div id="profile-number-container">
                            <ul>
                                <li>
                                    <div className="profile-number"><span>{stats.posts.toLocaleString()}</span><a
                                        href="">게시물</a></div>
                                </li>
                                <li>
                                    <div className="profile-number"><span>{stats.followers.toLocaleString()}</span><a
                                        href="">팔로워</a></div>
                                </li>
                                <li>
                                    <div className="profile-number"><span>{stats.following.toLocaleString()}</span><a
                                        href="">팔로잉</a></div>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <article>
                        <p>{userIntroduction?.trim() || "자기소개가 없습니다. 프로필을 수정하여 자기소개를 작성해보세요."}</p>
                    </article>
                </section>
            </div>

            {contextMenu.visible && (
                <ul
                    className="widget-context-menu"
                    style={{
                        position: "absolute",
                        top: `${contextMenu.y}px`,
                        left: `${contextMenu.x}px`,
                        backgroundColor: "#fff",
                        border: "1px solid #ccc",
                        padding: "5px 0",
                        zIndex: 9999,
                        listStyle: "none",
                    }}
                >
                    <li style={{ padding: "5px 10px", cursor: "pointer" }} onClick={() => navigate("/widget/edit" , { state: { widgetId: contextMenu.widgetId } })}>편집</li>
                    <li style={{ padding: "5px 10px", cursor: "pointer" }} onClick={() => alert(`삭제: ${contextMenu.widgetId}`)}>삭제</li>
                </ul>
            )}


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
                            onContextMenu={(e) => handleContextMenu(e, widget.id)}
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
                        <li><a href="mailto:user@example.com"><img src="/placeholder.svg" alt="email"/></a></li>
                        <li><a href="https://www.youtube.com"><img src="/placeholder.svg" alt="youtube"/></a></li>
                        <li><a href="https://www.instagram.com"><img src="/placeholder.svg" alt="instagram"/></a></li>
                    </ul>
                </address>
            </footer>
        </div>
    );
};

export default Mypage;