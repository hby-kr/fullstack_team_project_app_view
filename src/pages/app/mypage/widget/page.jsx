import React from 'react';
import './widgetPageStyle.css';

const WidgetPage = () => {
    return (
        <div id="widget-page-body">
            <header>
                <nav id="widget-page-nav">
                    <ul>
                        <li>
                            <a>취소</a>
                        </li>
                        <li>
                            <h1>위젯 설정</h1>
                        </li>
                        <li>
                            <a>완료</a>
                        </li>
                    </ul>
                </nav>
            </header>
            <main id="widget-page-main">
                <section>
                    <div className="widget-container">
                        <div className="weather-container weather-color three-one">
                            <div className="weather-sun"></div>
                            <div className="weather-main-container">
                                <ul className="weather-main">
                                    <li><span>15</span><span>&deg;C</span></li>
                                    <li><span>맑음</span></li>
                                </ul>
                                <ul className="weather-sub">
                                    <li>H:<span>20</span>&deg;<span>C</span></li>
                                    <li>L:<span>15</span>&deg;<span>C</span></li>
                                </ul>
                                <div className="weather-ex"><span>서울특별시</span></div>
                            </div>
                        </div>
                    </div>
                    <ul>
                        <li><img src="/" alt="레이아웃 편집"/></li>
                        <li><img src="/" alt="위치"/></li>
                        <li><img src="/" alt="테마"/></li>
                    </ul>
                </section>
                <section>
                    <ul className="theme-title">
                        <li><h2>테마 선택</h2></li>
                        <li><a href="/">더보기</a></li>
                    </ul>
                    <div className="widget-container">
                        <div className="weather-container one-one">
                        </div>
                        <div className="weather-container two-one">
                        </div>
                        <div className="weather-container three-one">
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default WidgetPage;