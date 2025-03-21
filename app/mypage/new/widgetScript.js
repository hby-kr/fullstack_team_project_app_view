// 드래그 앤 드롭 스크립트
document.addEventListener("DOMContentLoaded", () => {
    const widgetSection = document.querySelector("#widget-container section");
    const widgets = document.querySelectorAll(".widget");

    // 드래그 가능한 속성 추가
    widgets.forEach(widget => {
        widget.setAttribute("draggable", "true");

        // 드래그 시작 시 이벤트
        widget.addEventListener("dragstart", (e) => {
            e.dataTransfer.setData("text/plain", e.target.id); // 위젯의 ID 저장
            e.target.classList.add("dragging");
        });

        // 드래그 종료 시 이벤트
        widget.addEventListener("dragend", (e) => {
            e.target.classList.remove("dragging");
        });
    });

    // 드래그 대상 위젯을 놓을 때 이벤트
    widgetSection.addEventListener("dragover", (e) => {
        e.preventDefault(); // 기본 동작 방지
        const draggingWidget = document.querySelector(".dragging");
        const afterElement = getDragAfterElement(widgetSection, e.clientX);

        if (afterElement == null) {
            widgetSection.appendChild(draggingWidget);
        } else {
            widgetSection.insertBefore(draggingWidget, afterElement);
        }
    });

    // 드래그 후 추가를 위한 위치 계산 함수
    function getDragAfterElement(container, x) {
        const draggableElements = [...container.querySelectorAll(".widget:not(.dragging)")];

        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = x - box.top - box.height / 2;

            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }
});