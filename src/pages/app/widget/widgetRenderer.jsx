// src/utils/widgetRenderer.jsx

import React from "react";

export const renderWidgetContent = (widget) => {
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
                                    <span><div></div><a href="">이벤트</a></span>
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
                            <li><span>15</span><span>&deg;C</span></li>
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
        default:
            return null;
    }
};
