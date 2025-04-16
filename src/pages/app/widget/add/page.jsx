import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {renderWidgetContent} from "../widgetRenderer";
import "../edit/WidgetEdit.css";

const WidgetAdd = () => {
    const [allWidgets, setAllWidgets] = useState([]);
    const navigate = useNavigate();

    const userId = "user1001"; // 임시 유저 ID

    useEffect(() => {
        fetch("/api/widgets/all", {credentials: "include"})
            .then(res => res.json())
            .then(data => {
                console.log(data);
                const processed = data.map(widget => ({
                    id: `widget${widget.widget_id}`,
                    widget_id: widget.widget_id,
                    size: `${widget.widget_size}x1`,
                    type: widget.json || "unknown",
                    label: widget.label || ""
                }));
                setAllWidgets(processed);
            })
            .catch(err => {
                console.error("전체 위젯 로딩 실패:", err);
            });
    }, []);

    const handleWidgetClick = (widgetId) => {
        navigate("/widget/edit", {state: {widgetId: `widget${widgetId}`}});
    };

    return (
        <div className="widget-edit-page">
            <div className="edit-header">
                <button onClick={() => navigate("/mypage")}>← 돌아가기</button>
                <h3>추가 가능한 전체 위젯</h3>
                <div></div>
            </div>

            <section className="theme-widget-list"
                     style={{display: "flex", flexWrap: "wrap", gap: "1rem", justifyContent: "center"}}>
                {allWidgets.map(widget => (
                    <article
                        key={widget.id}
                        className={`widget size-${widget.size} ${widget.type}`}
                        style={{ cursor: "pointer" }}
                        onClick={() => handleWidgetClick(widget.widget_id)}
                    >
                        {renderWidgetContent(widget)}
                    </article>
                ))}
            </section>
        </div>
    );
};

export default WidgetAdd;