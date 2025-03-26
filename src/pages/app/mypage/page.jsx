import React, {useState, useEffect} from "react";
import './mypageStyle.css';
import './mypageRefined.css';
import './widgetStyle.css';
import './reactive.css';

;

const Mypage = () => {
    const [widgets, setWidgets] = useState([
        {id: "widget1", type: "calander", size: "1x1", label: "캘린더"},
        {id: "widget2", type: "calander", size: "2x1", label: "캘린더"},
        {id: "widget3", type: "calander", size: "3x1", label: "캘린더"},
        {id: "widget4", type: "weather", size: "1x1", label: "날씨"},
        {id: "widget5", type: "weather", size: "2x1", label: "날씨"},
        {id: "widget6", type: "weather", size: "3x1", label: "날씨"},
        {id: "widget7", type: "memo", size: "1x1", label: "메모"},
        {id: "widget8", type: "memo", size: "2x1", label: "메모"},
        {id: "widget9", type: "memo", size: "3x1", label: "메모"},
        {id: "widget10", type: "info", size: "1x1", label: "소개"},
        {id: "widget11", type: "bookmark", size: "1x1", label: "북마크"},
        {id: "widget12", type: "bookmark", size: "2x1", label: "북마크"},
        {id: "widget13", type: "bookmark", size: "3x1", label: "북마크"},
        {id: "widget14", type: "display", size: "1x1", label: "전시대"},
        {id: "widget15", type: "display", size: "2x1", label: "전시대"},
        {id: "widget16", type: "display", size: "3x1", label: "전시대"},
        {id: "widget17", type: "image", size: "1x1", label: "이미지"},
        {id: "widget18", type: "image", size: "2x1", label: "이미지"},
        {id: "widget19", type: "image", size: "3x1", label: "이미지"},
        {id: "widget20", type: "countdown", size: "1x1", label: "카운트다운"},
        {id: "widget21", type: "countdown", size: "2x1", label: "카운트다운"},
        {id: "widget22", type: "countdown", size: "3x1", label: "카운트다운"},
        {id: "widget23", type: "graph", size: "1x1", label: "그래프"},
        {id: "widget24", type: "graph", size: "2x1", label: "그래프"},
        {id: "widget25", type: "graph", size: "3x1", label: "그래프"},
    ]);

    const userName = "사용자님";
    const userEmail = "user@example.com";
    const userIntroduction = "자기소개를 작성해보세요.";
    const stats = {posts: 1234, followers: 5678, following: 910};

    useEffect(() => {
        document.title = `${userName}의 페이지`;
    }, [userName]);

    const onDragStart = (e, widgetId) => {
        e.dataTransfer.setData("widgetId", widgetId);
    };

    const onDragOver = (e) => {
        e.preventDefault();
    };

    const onDrop = (e) => {
        const widgetId = e.dataTransfer.getData("widgetId");
        setWidgets((prevWidgets) => {
            const draggedWidget = prevWidgets.find((widget) => widget.id === widgetId);
            const remainingWidgets = prevWidgets.filter((widget) => widget.id !== widgetId);
            return [draggedWidget, ...remainingWidgets];
        });
    };

    return (
        <div id="mypage-body">
            <header>
                <ul>
                    <li>
                        <h1>art U</h1>
                    </li>
                    <li>
                        <img src="/placeholder.svg" alt="profile_image"/>
                    </li>
                    <li>
                        <span>{userName}</span>
                    </li>
                </ul>
            </header>
            <aside>
                <div id="nav-container">
                    <section>
                        <h2>{userName}님의 페이지</h2>
                        <article>
                            <a href="">설정</a>
                        </article>
                    </section>
                </div>
            </aside>
            <div id="main-container">
                <section>
                    <div id="profile-container">
                        <img src="/placeholder.svg" alt="profile_image"/>
                        <ul>
                            <li>
                                <h3>{userName}</h3>
                            </li>
                            <li>
                                <p>{userEmail}</p>
                            </li>
                            <li>
                                <p>
                                    <a href="">프로필 편집하기</a>
                                </p>
                            </li>
                        </ul>
                        <div id="profile-number-container">
                            <ul>
                                <li>
                                    <div className="profile-number">
                                        <span>{stats.posts.toLocaleString()}</span>
                                        <a href="">게시물</a>
                                    </div>
                                </li>
                                <li>
                                    <div className="profile-number">
                                        <span>{stats.followers.toLocaleString()}</span>
                                        <a href="">팔로워</a>
                                    </div>
                                </li>
                                <li>
                                    <div className="profile-number">
                                        <span>{stats.following.toLocaleString()}</span>
                                        <a href="">팔로잉</a>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <article>
                        <p>
                            {userIntroduction && userIntroduction.trim() !== ""
                                ? userIntroduction
                                : "자기소개가 없습니다. 프로필을 수정하여 자기소개를 작성해보세요."}
                        </p>
                    </article>
                </section>
            </div>
            <nav>
                <ul>
                    <li>
                        <a href="">위젯</a>
                    </li>
                    <li>
                        <a href="">포스트</a>
                    </li>
                </ul>
            </nav>
            <div id="widget-container">
                <section onDragOver={onDragOver} onDrop={onDrop}>
                    {widgets.map((widget) => (
                        <article
                            key={widget.id}
                            id={widget.id}
                            className={`widget size-${widget.size} ${widget.type}`}
                            draggable={true}
                            onDragStart={(e) => onDragStart(e, widget.id)}
                        >
                            <div className={`${widget.type}-container`}>
                                {widget.type === "calander" && (
                                    <>
                                        <ul className="calander-main">
                                            <li><span>FRI</span></li>
                                            <li><h5>21</h5></li>
                                            <li><span>캘린더</span></li>
                                        </ul>
                                        {widget.size !== "1x1" && (
                                            <ul className="calander-sub">
                                                {Array(4).fill().map((_, i) => (
                                                    <li key={i} className="calander-sub-item">
                                                        <span>금요일 3월 21일</span>
                                                        <span><div></div><a href="">이벤트</a></span>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </>
                                )}
                                {widget.type === "weather" && (
                                    <>
                                        <div className="weather-sun"></div>
                                        <div className="weather-main-container">
                                            <ul className="weather-main">
                                                <li>
                                                    <span>15</span><span>&deg;C</span>
                                                </li>
                                            </ul>
                                            {widget.size !== "1x1" && (
                                                <ul className="weather-sub">
                                                    <li>H:<span>20</span>&deg;<span>C</span></li>
                                                    <li>L:<span>15</span>&deg;<span>C</span></li>
                                                </ul>
                                            )}
                                            {widget.size === "3x1" && (
                                                <ul className="weather-loc">
                                                    <li><span>서울특별시</span></li>
                                                </ul>
                                            )}
                                        </div>
                                    </>
                                )}
                                {widget.type === "memo" && (
                                    <div className="memo-container">
                                        {widget.size === "1x1" ? (
                                            <>
                                                <h5>메모</h5>
                                                <p>내용</p>
                                            </>
                                        ) : (
                                            <ul>
                                                <li><h5>메모</h5></li>
                                                <li><p>내용</p></li>
                                            </ul>
                                        )}
                                    </div>
                                )}
                                {widget.type === "bookmark" && (
                                    <div className="bookmark-container">
                                        <ul className="bookmark-main">
                                            {Array(widget.size === "2x1" ? 2 : widget.size === "3x1" ? 3 : 1).fill().map((_, i) => (
                                                <li key={i} className="bookmark-item">
                                                    <span>콘서트</span>
                                                    <span>콘서트 설명</span>
                                                </li>
                                            ))}
                                        </ul>
                                        {widget.size === "1x1" && (
                                            <div className="bookmark-sub">
                                                <span className="bookmark-sub-item">콘서트 설명</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                                {widget.type === "display" && (
                                    <div className="display-container">
                                        <ul className="display-main">
                                            {Array(widget.size === "1x1" ? 1 : widget.size === "2x1" ? 6 : 16).fill().map((_, i) => (
                                                <li key={i} className="display-item">
                                                    <img src="/placeholder.svg" alt=""/>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                {widget.type === "image" && (
                                    <div className="image-container">
                                        <img src="/placeholder.svg" alt=""/>
                                    </div>
                                )}
                                {widget.type === "countdown" && (
                                    <div className="countdown-container">
                                        <ul className="countdown-main">
                                            <li>D<span>-</span><span>12</span></li>
                                            <li><a href=""><span>콘서트</span></a></li>
                                        </ul>
                                    </div>
                                )}
                                {widget.type === "graph" && (
                                    <div className="graph-container">
                                        <canvas></canvas>
                                    </div>
                                )}
                            </div>
                        </article>
                    ))}
                </section>
            </div>
            <footer>
                <p>&copy; 2025 Art U</p>
                <address>
                    <ul>
                        <li>
                            <a href="mailto:user@example.com">
                                <img src="/placeholder.svg" alt="email"/>
                            </a>
                        </li>
                        <li>
                            <a href="https://www.youtube.com">
                                <img src="/placeholder.svg" alt="youtube"/>
                            </a>
                        </li>
                        <li>
                            <a href="https://www.instagram.com">
                                <img src="/placeholder.svg" alt="instagram"/>
                            </a>
                        </li>
                    </ul>
                </address>
            </footer>
        </div>
    );
};

export default Mypage;