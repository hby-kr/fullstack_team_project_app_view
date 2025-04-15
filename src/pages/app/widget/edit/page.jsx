import React, {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {widgetData} from "../widgetData.js";
import {renderWidgetContent} from "../widgetRenderer";
import {widgetTextEditData} from "./widgetTextEditData.js";

import "./WidgetEdit.css";

const WidgetEdit = () => {
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
                    {renderWidgetContent(selectedWidget)}
                </article>
                {/* 아이콘 버튼 */}
                <div className="widget-action-buttons">
                    <button id="widget-theme-edit" className="icon-button" onClick={() => setActiveSection("theme")}>테마</button>
                    <button id="widget-text-edit" className="icon-button" onClick={() => setActiveSection("text")}>텍스트</button>
                </div>
            </div>
            {/* 하단: 섹션 컨텐츠 */}
            {activeSection === "theme" && (
                <div className="theme-selection">
                    <h4>테마 선택</h4>
                    <section className="theme-widget-list">
                        {sameTypeWidgets.map(w => (
                                <article className={`widget size-${w.size} ${w.type}`}
                                         style={{ cursor: "pointer" }}
                                         onClick={() => setSelectedWidget(w)}>key={w.id}\
                                    {renderWidgetContent(w)}
                                </article>
                        ))}
                    </section>
                </div>
            )}
            {activeSection === "text" && (
                <div className="text-section">
                    <h4>텍스트 설정</h4>
                    <p>{`${selectedWidget.label}`}</p>
                    {selectedWidget.type === "memo" && (
                        <label className="memo-label">
                            <input type="text" placeholder="메모를 입력하세요" />
                            <button>제출</button>
                        </label>
                    )}
                    {selectedWidget.type === "info" && (
                        <label className="memo-label">
                            <input type="text" placeholder="소개 문구를 입력하세요" />
                            <button>제출</button>
                        </label>
                    )}
                    {selectedWidget.type === "display" && (
                        <input type="file" accept="image/png, image/jpeg" placeholder="이미지를 입력하세요" style={{ width: "100%" }} />
                    )}
                    {selectedWidget.type === "image" && (
                        <input type="file" accept="image/png, image/jpeg" placeholder="이미지를 입력하세요" style={{ width: "100%" }} />
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

