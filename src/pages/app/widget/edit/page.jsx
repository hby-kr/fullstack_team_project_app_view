import React, {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {widgetData} from "../widgetData.js";
import {renderWidgetContent} from "../widgetRenderer";
import {widgetLocationData} from "./widgetLocationData.js";
import {widgetTextEditData} from "./widgetTextEditData.js";

import "./WidgetEdit.css"; // 스타일 분리 추천

const WidgetEdit = () => {
    const loc = widgetLocationData;
    const text = widgetTextEditData;

    const [activeSection, setActiveSection] = useState("theme"); // 기본은 theme

    const location = useLocation();
    const widgetIdFromRoute = location.state?.widgetId;

    const [selectedWidget, setSelectedWidget] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const initialWidget = widgetData.find(w => w.id === widgetIdFromRoute);
        setSelectedWidget(initialWidget);
    }, [widgetIdFromRoute]);

    if (!selectedWidget) return <p>위젯을 찾을 수 없습니다.</p>;

    const sameTypeWidgets = widgetData.filter(w => w.type === selectedWidget.type);

    return (
        <div className="widget-edit-page">
            {/* 상단: 위젯 설정 헤더 */}
            <div className="edit-header">
                <button onClick={() => navigate(-1)}>취소</button>
                <h3>위젯 설정</h3>
                <button onClick={() => navigate("/mypage")}>완료</button>
            </div>

            {/* 선택된 위젯 미리보기 */}
            <div className="selected-widget-preview">
                <article className={`widget size-${selectedWidget.size} ${selectedWidget.type}`}>
                    <div className={`${selectedWidget.type}-container`}>
                        {renderWidgetContent(selectedWidget)}
                    </div>
                </article>

                {/* 아이콘 버튼 */}
                <div className="widget-action-buttons">
                    <button id="widget-theme-edit" className="icon-button" onClick={() => setActiveSection("theme")}>테마</button>
                    <button id="widget-location-edit" className="icon-button" onClick={() => setActiveSection("location")}>위치</button>
                    <button id="widget-text-edit" className="icon-button" onClick={() => setActiveSection("text")}>텍스트</button>
                </div>
            </div>

            {/* 하단: 섹션 컨텐츠 */}
            {activeSection === "theme" && (
                <div className="theme-selection">
                    <h4>테마 선택</h4>
                    <div className="theme-widget-list">
                        {sameTypeWidgets.map(w => (
                            <div
                                key={w.id}
                                className="theme-widget-card"
                                onClick={() => setSelectedWidget(w)}
                                style={{ cursor: "pointer" }}
                            >
                                <article className={`widget size-${w.size} ${w.type}`}>
                                    <div className={`${w.type}-container`}>
                                        {renderWidgetContent(w)}
                                    </div>
                                </article>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeSection === "location" && (
                <div className="location-section">
                    <h4>위치 설정</h4>
                    <p>{`현재 위젯: ${selectedWidget.label} (${selectedWidget.size})`}</p>
                    <div>
                        {selectedWidget.size === "1x1" && <p>1x1 위치 선택 UI</p>}
                        {selectedWidget.size === "2x1" && <p>2x1 위치 선택 UI</p>}
                        {selectedWidget.size === "3x1" && <p>3x1 위치 선택 UI</p>}
                    </div>
                </div>
            )}

            {activeSection === "text" && (
                <div className="text-section">
                    <h4>텍스트 설정</h4>
                    <p>{`현재 위젯: ${selectedWidget.label}`}</p>
                    {selectedWidget.type === "memo" && (
                        <textarea placeholder="메모를 입력하세요" style={{ width: "100%", height: "100px" }} />
                    )}
                    {selectedWidget.type === "info" && (
                        <input type="text" placeholder="소개 문구를 입력하세요" style={{ width: "100%" }} />
                    )}
                    {selectedWidget.type !== "memo" && selectedWidget.type !== "info" && (
                        <p>이 위젯은 텍스트 설정이 필요하지 않습니다.</p>
                    )}
                </div>
            )}

        </div>
    );
};

export default WidgetEdit;

