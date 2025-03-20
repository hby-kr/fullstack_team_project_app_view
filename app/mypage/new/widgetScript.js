document.addEventListener("DOMContentLoaded", () => {
    const widgetContainer = document.getElementById("widget-container");
    const widgets = document.querySelectorAll(".widget");
    let activeWidget = null;

    // 드래그 시작 핸들러
    widgets.forEach((widget) => {
        widget.addEventListener("mousedown", (event) => {
            event.preventDefault();
            startDrag(event, widget);
        });
    });

    function startDrag(event, widget) {
        activeWidget = widget;
        const gridRect = widgetContainer.getBoundingClientRect();

        const offsetX = event.clientX - widget.getBoundingClientRect().left;
        const offsetY = event.clientY - widget.getBoundingClientRect().top;

        function onMouseMove(e) {
            let x = Math.floor((e.clientX - gridRect.left - offsetX) / 160) * 160; // 셀 크기 150px + 10px(gap)
            let y = Math.floor((e.clientY - gridRect.top - offsetY) / 160) * 160;

            // 경계값 제한
            x = Math.max(0, Math.min(x, gridRect.width - widget.offsetWidth));
            y = Math.max(0, Math.min(y, gridRect.height - widget.offsetHeight));

            widget.style.transform = `translate(${x}px, ${y}px)`;
        }

        function onMouseUp() {
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
            // 드롭 시 위치를 정렬
            const finalX = Math.round(parseFloat(widget.style.transform.split(",")[0].replace("translate(", "")) / 160);
            const finalY = Math.round(parseFloat(widget.style.transform.split(",")[1].replace("px)", "")) / 160);

            widget.style.transform = "";
            widget.style.gridColumnStart = finalX + 1;
            widget.style.gridRowStart = finalY + 1;
        }

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    }

    // 크기 변경 이벤트
    document.querySelectorAll(".resize-handle").forEach((handle) => {
        handle.addEventListener("click", (event) => {
            event.stopPropagation();
            const widget = event.target.parentElement;

            // 순환적으로 크기 변경 (1x1 -> 1x2 -> 1x3)
            if (widget.classList.contains("size-1x1")) {
                widget.classList.remove("size-1x1");
                widget.classList.add("size-1x2");
            } else if (widget.classList.contains("size-1x2")) {
                widget.classList.remove("size-1x2");
                widget.classList.add("size-1x3");
            } else if (widget.classList.contains("size-1x3")) {
                widget.classList.remove("size-1x3");
                widget.classList.add("size-1x1");
            }
        });
    });
});