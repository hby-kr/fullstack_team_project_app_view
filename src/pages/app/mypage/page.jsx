import React, {useState, useEffect} from "react";
import {Settings} from "lucide-react";
import {useNavigate, Link} from "react-router-dom";

import './mypageStyle.css';
import './mypageRefined.css';
import './widgetStyle.css';
import './reactive.css';

import { renderWidgetContent } from "../widget/widgetRenderer";

const Mypage = () => {
    const [widgets, setWidgets] = useState([]);
    const [draggingWidget, setDraggingWidget] = useState(null);

    const userName = "사용자님";
    const userEmail = "user@example.com";
    const userIntroduction = "자기소개를 작성해보세요.";
    const stats = {posts: 1234, followers: 5678, following: 910};

    useEffect(() => {
        const userId = "user1001"; // 가정된 유저 ID
        fetch(`/api/widgets/used?userId=${userId}`, {
            credentials: "include"
        })
            .then((res) => res.json())
            .then((data) => {
                console.log("서버로부터 받아온 위젯 데이터:", data);

                const processedData = data.map(widget => ({
                    id: `widget${widget.widget_id}`,
                    type: widget.widget_json?.type || "unknown",
                    label: widget.widget_json?.label || "",
                    size: `${widget.widget_size}x1`,
                    widget_content: widget.widget_content || "" // 👈 추가
                }));

                setWidgets(processedData);
            })
            .catch((err) => {
                console.error("위젯 데이터를 가져오는 데 실패했습니다:", err);
            });
    }, []);

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

        saveWidgetOrder(updatedWidgets); // 순서 저장
        e.currentTarget.classList.remove("drag-over");
        setDraggingWidget(null);
    };

    const saveWidgetOrder = (updatedWidgets) => {
        const userId = "user1001";
        const orderData = updatedWidgets.map((widget, index) => ({
            widget_id: parseInt(widget.id.replace("widget", "")),
            user_id: userId,
            order: index
        }));

        fetch("/api/widgets/order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(orderData)
        }).then(res => {
            if (!res.ok) alert("순서 저장 실패");
        });
    };


    const [contextMenu, setContextMenu] = useState({visible: false, x: 0, y: 0, widgetId: null});

    const handleContextMenu = (e, widgetId) => {
        e.preventDefault();
        setContextMenu({visible: true, x: e.pageX, y: e.pageY, widgetId});
    };

    const handleCloseContextMenu = () => {
        setContextMenu({...contextMenu, visible: false});
    };

    const handleDeleteWidget = () => {
        const widgetIdNum = parseInt(contextMenu.widgetId.replace("widget", ""));
        const userId = "user1001"; // 고정 유저 ID (혹은 로그인 유저로 추후 변경)

        fetch(`/api/widgets/delete/${widgetIdNum}?userId=${userId}`, {
            method: "DELETE",
            credentials: "include"
        })
            .then(res => {
                if (res.ok) {
                    setWidgets(prev => prev.filter(w => w.id !== contextMenu.widgetId));
                    setContextMenu({...contextMenu, visible: false});
                } else {
                    alert("삭제 실패");
                }
            })
            .catch(err => {
                console.error("삭제 중 오류:", err);
                alert("삭제 중 오류 발생");
            });
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
                    <li style={{ padding: "5px 10px", cursor: "pointer" }} onClick={handleDeleteWidget}>삭제</li>
                </ul>
            )}


            {/* Widgets */}
            <div id="widget-container">
                <button className="add-widget-button" onClick={() => navigate("/widget/add")} style={{ margin: "1rem", padding: "0.5rem 1rem" }}>
                    + 위젯 추가하기
                </button>
                <section onDragOver={onDragOver} onDrop={onDrop} onDragEnd={onDragEnd}>
                    {widgets.map((widget, index) => (
                        <article
                            key={`${widget.id}-${index}`}
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