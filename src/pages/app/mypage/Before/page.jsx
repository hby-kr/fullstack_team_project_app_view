"use client"

import  React from "react"

import {useEffect, useState, useCallback} from "react"
import {Link, useNavigate} from "react-router"
//import Link from "next/link"
//import Image from "next/image"
import {useAuth} from "/src/lib/auth-context"
import {
    User,
    Heart,
    MessageSquare,
    Music,
    Users,
    ImageIcon,
    Calendar,
    Pencil,
    Save,
    Play,
    FileText,
    Cloud,
    Clock,
    Award,
    BarChart,
    Sun,
    Move,
    Trash2,
    GripVertical,
    ChevronUp,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Plus,
    Minus,
    Upload,
    Palette,
} from "lucide-react"

// CSS 임포트
import "./grid-layout.css"

// 클라이언트 사이드에서만 로드되도록 dynamic import 사용
import dynamic from "next/dynamic"

const GridLayout = dynamic(() => import("react-grid-layout"), {ssr: false})

// 위젯 타입 수정 - 게시물과 게시물 관리 위젯 통합
// type WidgetType =
// | "today"
// | "visitors"
// | "photos"
// | "music"
// | "guestbook"
// | "calendar"
// | "memo"
// | "weather"
// | "dday"
// | "trophy"
// | "stats"
// | "posts" // 통합된 게시물 위젯

// interface Widget {
//     id: string
//     type: WidgetType
//     title: string
//     content?: any
//     i: string // grid layout id
//     x: number // grid x position
//     y: number // grid y position
//     w: number // grid width
//     h: number // grid height
//     minW?: number
//     minH?: number
//     maxW?: number
//     maxH?: number
//     backgroundColor?: string // 위젯 배경색
//     textColor?: string // 위젯 텍스트 색상
//     headerBackgroundColor?: string // 위젯 헤더 배경색
//     headerTextColor?: string // 위젯 헤더 텍스트 색상
// }

// 위젯 색상 프리셋
const widgetColorPresets = [
    {name: "기본", backgroundColor: "white", textColor: "text-gray-900"},
    {name: "블루", backgroundColor: "bg-blue-50", textColor: "text-gray-900"},
    {name: "그린", backgroundColor: "bg-green-50", textColor: "text-gray-900"},
    {name: "퍼플", backgroundColor: "bg-purple-50", textColor: "text-gray-900"},
    {name: "핑크", backgroundColor: "bg-pink-50", textColor: "text-gray-900"},
    {name: "옐로우", backgroundColor: "bg-yellow-50", textColor: "text-gray-900"},
    {name: "다크", backgroundColor: "bg-gray-800", textColor: "text-white"},
]

// 텍스트 색상 프리셋 추가
const textColorPresets = [
    {name: "검정", value: "text-gray-900", bgColor: "bg-white"},
    {name: "흰색", value: "text-white", bgColor: "bg-gray-800"},
    {name: "회색", value: "text-gray-500", bgColor: "bg-white"},
    {name: "파랑", value: "text-blue-600", bgColor: "bg-white"},
    {name: "초록", value: "text-green-600", bgColor: "bg-white"},
    {name: "보라", value: "text-purple-600", bgColor: "bg-white"},
    {name: "핑크", value: "text-pink-600", bgColor: "bg-white"},
]

// Sample post data
const samplePosts = [
    {
        id: "post1",
        title: "첫 번째 공연 후기",
        content:
            "지난 주말에 다녀온 클래식 공연은 정말 인상적이었습니다. 특히 바이올린 솔로 부분에서는 감동의 눈물을 흘렸습니다.",
        date: "2024-03-01",
        image: "/placeholder.svg?height=300&width=400&text=Concert1",
    },
    {
        id: "post2",
        title: "미술관 전시회 방문",
        content:
            "현대 미술관에서 열린 특별 전시회를 다녀왔습니다. 다양한 작품들이 인상적이었고, 특히 미디어 아트 섹션이 기억에 남습니다.",
        date: "2024-02-15",
        image: "/placeholder.svg?height=300&width=400&text=Exhibition",
    },
    {
        id: "post3",
        title: "춤 워크샵 참여 후기",
        content:
            "주말에 참여한 현대무용 워크샵은 정말 유익했습니다. 새로운 동작과 표현 방법을 배울 수 있었고, 다른 참가자들과의 교류도 즐거웠습니다.",
        date: "2024-01-20",
        image: "/placeholder.svg?height=300&width=400&text=Dance",
    },
]

// 미리 정의된 레이아웃 템플릿
const layoutTemplates = {
    standard: [
        {id: "today", type: "today", title: "투데이", i: "today", x: 0, y: 0, w: 6, h: 2, minH: 2, minW: 3},
        {id: "visitors", type: "visitors", title: "방문자", i: "visitors", x: 6, y: 0, w: 6, h: 2, minH: 2, minW: 3},
        {id: "photos", type: "photos", title: "사진첩", i: "photos", x: 0, y: 2, w: 6, h: 3, minH: 3, minW: 3},
        {id: "music", type: "music", title: "음악", i: "music", x: 6, y: 2, w: 6, h: 2, minH: 2, minW: 3},
    ],
    blog: [
        {
            id: "post1",
            type: "post",
            title: "게시물",
            i: "post1",
            x: 0,
            y: 0,
            w: 12,
            h: 3,
            minH: 3,
            minW: 6,
            content: samplePosts[0],
        },
        {
            id: "post2",
            type: "post",
            title: "게시물",
            i: "post2",
            x: 0,
            y: 3,
            w: 12,
            h: 3,
            minH: 3,
            minW: 6,
            content: samplePosts[1],
        },
        {
            id: "post3",
            type: "post",
            title: "게시물",
            i: "post3",
            x: 0,
            y: 6,
            w: 12,
            h: 3,
            minH: 3,
            minW: 6,
            content: samplePosts[2],
        },
    ],
    dashboard: [
        {id: "stats", type: "stats", title: "통계", i: "stats", x: 0, y: 0, w: 6, h: 3, minH: 3, minW: 3},
        {id: "calendar", type: "calendar", title: "캘린더", i: "calendar", x: 6, y: 0, w: 6, h: 3, minH: 3, minW: 3},
        {id: "dday", type: "dday", title: "D-day", i: "dday", x: 0, y: 3, w: 6, h: 2, minH: 2, minW: 3},
        {id: "trophy", type: "trophy", title: "트로피", i: "trophy", x: 6, y: 3, w: 6, h: 3, minH: 3, minW: 3},
    ],
}

export default function MyPage() {
    // const router = useRouter()
    const navigate = useNavigate();
    const {user, logout, isLoading} = useAuth()
    const [isCustomizing, setIsCustomizing] = useState(false)
    const [widgets, setWidgets] = useState([]);
    const [availableWidgets, setAvailableWidgets] = useState([]);
    const [layout, setLayout] = useState([]);
    const [mounted, setMounted] = useState(false)
    const [selectedWidgetId, setSelectedWidgetId] = useState(null);
    const [showPositionControls, setShowPositionControls] = useState(false)
    const [showColorControls, setShowColorControls] = useState(false)
    const [showTemplateSelector, setShowTemplateSelector] = useState(false)
    const [skinColor, setSkinColor] = useState("gray-50");
    const [showSkinSelector, setShowSkinSelector] = useState(false)
    const [skinOptions] = useState([
        {name: "기본", value: "gray-50", textColor: "text-gray-900"},
        {name: "블루", value: "blue-50", textColor: "text-gray-900"},
        {name: "그린", value: "green-50", textColor: "text-gray-900"},
        {name: "퍼플", value: "purple-50", textColor: "text-gray-900"},
        {name: "핑크", value: "pink-50", textColor: "text-gray-900"},
        {name: "다크", value: "gray-800", textColor: "text-white"},
        {name: "사용자 정의", value: "custom", textColor: "text-gray-900"},
    ])
    const [customColor, setCustomColor] = useState("#FFFFFF")
    const [customWidgetColor, setCustomWidgetColor] = useState("#FFFFFF")
    const [backgroundImage, setBackgroundImage] = useState(null);
    const [backgroundImageUrl, setBackgroundImageUrl] = useState("")
    const [customHeaderColor, setCustomHeaderColor] = useState("#6366F1")
    // 다음 상태 변수 추가
    const [customWidgetTextColor, setCustomWidgetTextColor] = useState("#000000")
    const [customHeaderTextColor, setCustomHeaderTextColor] = useState("#FFFFFF")
    const [customSkinTextColor, setCustomSkinTextColor] = useState("#000000")
    const [showGuide, setShowGuide] = useState(false)

    const handleCustomColorChange = (e) => {
        setCustomColor(e.target.value);
    }

    const handleCustomWidgetColorChange = (e) => {
        setCustomWidgetColor(e.target.value);
    }

    const applyCustomColor = () => {
        saveSkinPreference(`custom-${customColor.replace("#", "")}`)
    }

    // const applyCustomWidgetColor = () => {
    //     if (selectedWidgetId) {
    //         updateWidgetColor(selectedWidgetId, `custom-${customWidgetColor.replace("#", "")}`, "")
    //     }
    // }

    // 컴포넌트가 마운트되었는지 확인
    useEffect(() => {
        setMounted(true)
    }, [])

    // Load widgets from localStorage
    const loadData = useCallback(() => {
        if (typeof window !== "undefined") {
            // Define available widgets
            setAvailableWidgets([
                {type: "today", title: "투데이", icon: <MessageSquare className="w-5 h-5 text-primary"/>},
                {type: "visitors", title: "방문자", icon: <Users className="w-5 h-5 text-primary"/>},
                {type: "photos", title: "사진첩", icon: <ImageIcon className="w-5 h-5 text-primary"/>},
                {type: "music", title: "음악", icon: <Music className="w-5 h-5 text-primary"/>},
                {type: "guestbook", title: "방명록", icon: <MessageSquare className="w-5 h-5 text-primary"/>},
                {type: "calendar", title: "캘린더", icon: <Calendar className="w-5 h-5 text-primary"/>},
                {type: "memo", title: "메모장", icon: <FileText className="w-5 h-5 text-primary"/>},
                {type: "weather", title: "날씨", icon: <Cloud className="w-5 h-5 text-primary"/>},
                {type: "dday", title: "D-day", icon: <Clock className="w-5 h-5 text-primary"/>},
                {type: "trophy", title: "트로피", icon: <Award className="w-5 h-5 text-primary"/>},
                {type: "stats", title: "통계", icon: <BarChart className="w-5 h-5 text-primary"/>},
                {type: "posts", title: "게시물", icon: <FileText className="w-5 h-5 text-primary"/>},
            ])

            // Load saved layout
            const savedWidgets = localStorage.getItem("user_widgets")
            const savedLayout = localStorage.getItem("user_layout")

            if (savedWidgets && savedLayout) {
                try {
                    setWidgets(JSON.parse(savedWidgets))
                    setLayout(JSON.parse(savedLayout))
                } catch (e) {
                    console.error("Error parsing saved layout:", e)
                    setDefaultLayout()
                }
            } else {
                setDefaultLayout()
            }
        }
    }, [])

    useEffect(() => {
        loadData()
    }, [loadData])

    useEffect(() => {
        const savedBackgroundImage = localStorage.getItem("user_background_image")
        if (savedBackgroundImage) {
            setBackgroundImage(savedBackgroundImage)
        }
    }, [])

    // Load skin preference from localStorage
    useEffect(() => {
        if (typeof window !== "undefined") {
            const savedSkin = localStorage.getItem("user_skin")
            if (savedSkin) {
                setSkinColor(savedSkin)
            }

            // 스킨 텍스트 색상 로드 추가
            const savedSkinText = localStorage.getItem("user_skin_text")
            if (savedSkinText) {
                // 여기서는 상태를 저장만 하고, 렌더링 시 사용
                localStorage.setItem("user_skin_text", savedSkinText)
            }
        }
    }, [])

    // Save skin preference
    const saveSkinPreference = (color) => {
        if (color.includes("|")) {
            // 배경색과 텍스트 색상이 함께 지정된 경우
            const [bgColor, textColor] = color.split("|")
            setSkinColor(bgColor)
            localStorage.setItem("user_skin", bgColor)
            localStorage.setItem("user_skin_text", textColor)
        } else {
            // 배경색만 지정된 경우
            setSkinColor(color)
            localStorage.setItem("user_skin", color)
        }
        setShowSkinSelector(false)
    }

    // 위젯 색상 업데이트
    const updateWidgetColor = (
        widgetId,
        backgroundColor,
        textColor,
        headerBackgroundColor,
        headerTextColor,
    ) => {
        const updatedWidgets = widgets.map((widget) => {
            if (widget.id === widgetId) {
                return {
                    ...widget,
                    backgroundColor,
                    textColor,
                    headerBackgroundColor: headerBackgroundColor || widget.headerBackgroundColor,
                    headerTextColor: headerTextColor || widget.headerTextColor,
                }
            }
            return widget
        })

        setWidgets(updatedWidgets)
        saveLayout(updatedWidgets, layout)
    }

    // Set default layout
    const setDefaultLayout = () => {
        const defaultWidgets = [
            {id: "today", type: "today", title: "투데이", i: "today", x: 0, y: 0, w: 6, h: 2, minH: 2, minW: 3},
            {id: "visitors", type: "visitors", title: "방문자", i: "visitors", x: 6, y: 0, w: 6, h: 2, minH: 2, minW: 3},
            {id: "photos", type: "photos", title: "사진첩", i: "photos", x: 0, y: 2, w: 6, h: 3, minH: 3, minW: 3},
            {id: "music", type: "music", title: "음악", i: "music", x: 6, y: 2, w: 6, h: 2, minH: 2, minW: 3},
            {
                id: "posts",
                type: "posts",
                title: "게시물",
                i: "posts",
                x: 0,
                y: 5,
                w: 12,
                h: 4,
                minH: 4,
                minW: 6,
                backgroundColor: "white",
                textColor: "text-gray-900",
                headerBackgroundColor: "bg-primary",
                headerTextColor: "text-white",
            },
        ]

        const defaultLayout = defaultWidgets.map((widget) => ({
            i: widget.i,
            x: widget.x,
            y: widget.y,
            w: widget.w,
            h: widget.h,
            minW: widget.minW || 3,
            minH: widget.minH || 2,
        }))

        setWidgets(defaultWidgets)
        setLayout(defaultLayout)

        if (typeof window !== "undefined") {
            localStorage.setItem("user_widgets", JSON.stringify(defaultWidgets))
            localStorage.setItem("user_layout", JSON.stringify(defaultLayout))
        }
    }

    // 템플릿 적용 함수
    const applyTemplate = (templateName) => {
        const templateWidgets = layoutTemplates[templateName]

        // 위젯 ID가 중복되지 않도록 타임스탬프 추가
        const timestamp = Date.now()
        const newWidgets = templateWidgets.map((widget) => ({
            ...widget,
            id: `${widget.id}-${timestamp}`,
            i: `${widget.id}-${timestamp}`,
        }))

        const newLayout = newWidgets.map((widget) => ({
            i: widget.i,
            x: widget.x,
            y: widget.y,
            w: widget.w,
            h: widget.h,
            minW: widget.minW || 3,
            minH: widget.minH || 2,
        }))

        // @ts-ignore
        setWidgets(newWidgets)
        setLayout(newLayout)
        // @ts-ignore
        saveLayout(newWidgets, newLayout)
        setShowTemplateSelector(false)
    }

    // Add a new widget
    const addWidget = (widgetType) => {
        const newId = `${widgetType}-${Date.now()}`
        const widgetTitle = availableWidgets.find((w) => w.type === widgetType)?.title || "위젯"

        // Find the highest y position to place the new widget at the bottom
        const maxY = Math.max(...widgets.map((w) => w.y + w.h), 0)

        const newWidget = {
            id: newId,
            type: widgetType,
            title: widgetTitle,
            i: newId,
            x: 0,
            y: maxY,
            w: widgetType === "posts" ? 12 : 6,
            h: widgetType === "posts" ? 4 : 2,
            minW: widgetType === "posts" ? 6 : 3,
            minH: widgetType === "posts" ? 4 : 2,
            backgroundColor: "white",
            textColor: "text-gray-900",
            headerBackgroundColor: "bg-primary",
            headerTextColor: "text-white",
        }

        const updatedWidgets = [...widgets, newWidget]
        setWidgets(updatedWidgets)

        // Update layout
        const updatedLayout = [
            ...layout,
            {
                i: newId,
                x: 0,
                y: maxY,
                w: widgetType === "posts" ? 12 : 6,
                h: widgetType === "posts" ? 4 : 2,
                minW: widgetType === "posts" ? 6 : 3,
                minH: widgetType === "posts" ? 4 : 2,
            },
        ]

        setLayout(updatedLayout)
        saveLayout(updatedWidgets, updatedLayout)

        // 새 위젯을 선택 상태로 만들기
        setSelectedWidgetId(newId)
    }

    // Remove a widget
    const removeWidget = (id) => {
        const updatedWidgets = widgets.filter((widget) => widget.id !== id)
        setWidgets(updatedWidgets)

        // Update layout
        const updatedLayout = layout.filter((item) => item.i !== id)

        setLayout(updatedLayout)
        saveLayout(updatedWidgets, updatedLayout)

        // 선택된 위젯이 삭제된 경우 선택 해제
        if (selectedWidgetId === id) {
            setSelectedWidgetId(null)
            setShowPositionControls(false)
            setShowColorControls(false)
        }
    }

    // Save layout to localStorage
    const saveLayout = (updatedWidgets = widgets, updatedLayout = layout) => {
        if (typeof window !== "undefined") {
            localStorage.setItem("user_widgets", JSON.stringify(updatedWidgets))
            localStorage.setItem("user_layout", JSON.stringify(updatedLayout))
        }
    }

    // Handle layout change
    const handleLayoutChange = (newLayout) => {
        setLayout(newLayout)

        // Update widget positions based on the new layout
        const updatedWidgets = widgets.map((widget) => {
            const layoutItem = newLayout.find((item) => item.i === widget.i)
            if (layoutItem) {
                return {
                    ...widget,
                    x: layoutItem.x,
                    y: layoutItem.y,
                    w: layoutItem.w,
                    h: layoutItem.h,
                }
            }
            return widget
        })

        setWidgets(updatedWidgets)
        saveLayout(updatedWidgets, newLayout)
    }

    // Toggle customization mode
    const toggleCustomizing = () => {
        const newCustomizingState = !isCustomizing
        setIsCustomizing(newCustomizingState)

        if (newCustomizingState) {
            // 꾸미기 모드로 진입할 때 가이드 표시
            setShowGuide(true)
        } else {
            // Save any pending changes when exiting customization mode
            saveLayout()
            setSelectedWidgetId(null)
            setShowPositionControls(false)
            setShowColorControls(false)
            setShowGuide(false)
        }
    }

    // 위젯 선택 함수
    const selectWidget = (id) => {
        if (isCustomizing) {
            setSelectedWidgetId(id)
        }
    }

    // 위젯 위치 수동 조정 함수들
    const moveWidgetUp = (id) => {
        const widgetIndex = widgets.findIndex((w) => w.id === id)
        if (widgetIndex === -1) return

        const widget = widgets[widgetIndex]
        if (widget.y <= 0) return // 이미 최상단

        const updatedWidgets = [...widgets]
        updatedWidgets[widgetIndex] = {
            ...widget,
            y: widget.y - 1,
        }

        const updatedLayout = layout.map((item) => {
            if (item.i === id) {
                return {
                    ...item,
                    y: item.y - 1,
                }
            }
            return item
        })

        setWidgets(updatedWidgets)
        setLayout(updatedLayout)
        saveLayout(updatedWidgets, updatedLayout)
    }

    const moveWidgetDown = (id) => {
        const widgetIndex = widgets.findIndex((w) => w.id === id)
        if (widgetIndex === -1) return

        const widget = widgets[widgetIndex]

        const updatedWidgets = [...widgets]
        updatedWidgets[widgetIndex] = {
            ...widget,
            y: widget.y + 1,
        }

        const updatedLayout = layout.map((item) => {
            if (item.i === id) {
                return {
                    ...item,
                    y: item.y + 1,
                }
            }
            return item
        })

        setWidgets(updatedWidgets)
        setLayout(updatedLayout)
        saveLayout(updatedWidgets, updatedLayout)
    }

    const moveWidgetLeft = (id) => {
        const widgetIndex = widgets.findIndex((w) => w.id === id)
        if (widgetIndex === -1) return

        const widget = widgets[widgetIndex]
        if (widget.x <= 0) return // 이미 최좌측

        const updatedWidgets = [...widgets]
        updatedWidgets[widgetIndex] = {
            ...widget,
            x: widget.x - 1,
        }

        const updatedLayout = layout.map((item) => {
            if (item.i === id) {
                return {
                    ...item,
                    x: item.x - 1,
                }
            }
            return item
        })

        setWidgets(updatedWidgets)
        setLayout(updatedLayout)
        saveLayout(updatedWidgets, updatedLayout)
    }

    const moveWidgetRight = (id) => {
        const widgetIndex = widgets.findIndex((w) => w.id === id)
        if (widgetIndex === -1) return

        const widget = widgets[widgetIndex]
        if (widget.x + widget.w >= 12) return // 그리드 너비(12) 초과 방지

        const updatedWidgets = [...widgets]
        updatedWidgets[widgetIndex] = {
            ...widget,
            x: widget.x + 1,
        }

        const updatedLayout = layout.map((item) => {
            if (item.i === id) {
                return {
                    ...item,
                    x: item.x + 1,
                }
            }
            return item
        })

        setWidgets(updatedWidgets)
        setLayout(updatedLayout)
        saveLayout(updatedWidgets, updatedLayout)
    }

    // 위젯 크기 수동 조정 함수들
    const increaseWidgetWidth = (id) => {
        const widgetIndex = widgets.findIndex((w) => w.id === id)
        if (widgetIndex === -1) return

        const widget = widgets[widgetIndex]
        if (widget.x + widget.w + 1 > 12) return // 그리드 너비(12) 초과 방지

        const updatedWidgets = [...widgets]
        updatedWidgets[widgetIndex] = {
            ...widget,
            w: widget.w + 1,
        }

        const updatedLayout = layout.map((item) => {
            if (item.i === id) {
                return {
                    ...item,
                    w: item.w + 1,
                }
            }
            return item
        })

        setWidgets(updatedWidgets)
        setLayout(updatedLayout)
        saveLayout(updatedWidgets, updatedLayout)
    }

    const decreaseWidgetWidth = (id) => {
        const widgetIndex = widgets.findIndex((w) => w.id === id)
        if (widgetIndex === -1) return

        const widget = widgets[widgetIndex]
        if (widget.w <= (widget.minW || 3)) return // 최소 너비 보다 작아지지 않도록

        const updatedWidgets = [...widgets]
        updatedWidgets[widgetIndex] = {
            ...widget,
            w: widget.w - 1,
        }

        const updatedLayout = layout.map((item) => {
            if (item.i === id) {
                return {
                    ...item,
                    w: item.w - 1,
                }
            }
            return item
        })

        setWidgets(updatedWidgets)
        setLayout(updatedLayout)
        saveLayout(updatedWidgets, updatedLayout)
    }

    const increaseWidgetHeight = (id) => {
        const widgetIndex = widgets.findIndex((w) => w.id === id)
        if (widgetIndex === -1) return

        const widget = widgets[widgetIndex]

        const updatedWidgets = [...widgets]
        updatedWidgets[widgetIndex] = {
            ...widget,
            h: widget.h + 1,
        }

        const updatedLayout = layout.map((item) => {
            if (item.i === id) {
                return {
                    ...item,
                    h: item.h + 1,
                }
            }
            return item
        })

        setWidgets(updatedWidgets)
        setLayout(updatedLayout)
        saveLayout(updatedWidgets, updatedLayout)
    }

    const decreaseWidgetHeight = (id) => {
        const widgetIndex = widgets.findIndex((w) => w.id === id)
        if (widgetIndex === -1) return

        const widget = widgets[widgetIndex]
        if (widget.h <= (widget.minH || 2)) return // 최소 높이 보다 작아지지 않도록

        const updatedWidgets = [...widgets]
        updatedWidgets[widgetIndex] = {
            ...widget,
            h: widget.h - 1,
        }

        const updatedLayout = layout.map((item) => {
            if (item.i === id) {
                return {
                    ...item,
                    h: item.h - 1,
                }
            }
            return item
        })

        setWidgets(updatedWidgets)
        setLayout(updatedLayout)
        saveLayout(updatedWidgets, updatedLayout)
    }

    const handleBackgroundImageUpload = (event) => {
        const file = event.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                const result = reader.result
                setBackgroundImage(result)
                localStorage.setItem("user_background_image", result)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleBackgroundImageUrlChange = (event) => {
        setBackgroundImageUrl(event.target.value)
    }

    const applyBackgroundImageUrl = () => {
        if (backgroundImageUrl) {
            setBackgroundImage(backgroundImageUrl)
            localStorage.setItem("user_background_image", backgroundImageUrl)
            setBackgroundImageUrl("")
        }
    }

    const removeBackgroundImage = () => {
        setBackgroundImage(null)
        localStorage.removeItem("user_background_image")
    }

    // photos 위젯 컴포넌트 추가
    const PhotosWidget = ({ widget }) => {
        const [photoAlbum, setPhotoAlbum] = useState(() => {
            if (typeof window === "undefined") return []
            const saved = localStorage.getItem(`photos-${widget.id}`)
            return saved
                ? JSON.parse(saved)
                : [
                    "/placeholder.svg?height=80&width=80&text=Photo1",
                    "/placeholder.svg?height=80&width=80&text=Photo2",
                    "/placeholder.svg?height=80&width=80&text=Photo3",
                    "/placeholder.svg?height=80&width=80&text=Photo4",
                    "/placeholder.svg?height=80&width=80&text=Photo5",
                    "/placeholder.svg?height=80&width=80&text=Photo6",
                ]
        })
        const [showPhotoUpload, setShowPhotoUpload] = useState(false)

        const handlePhotoUpload = (e) => {
            const files = e.target.files
            if (!files || files.length === 0) return

            const file = files[0]
            const reader = new FileReader()

            reader.onloadend = () => {
                const newPhotos = [...photoAlbum]
                if (newPhotos.length >= 6) newPhotos.pop()
                newPhotos.unshift(reader.result)
                setPhotoAlbum(newPhotos)
                localStorage.setItem(`photos-${widget.id}`, JSON.stringify(newPhotos))
                setShowPhotoUpload(false)
            }

            reader.readAsDataURL(file)
        }

        return (
            <div className="p-4">
                {showPhotoUpload ? (
                    <div className="mb-3">
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-sm font-medium">사진 추가</label>
                            <button onClick={() => setShowPhotoUpload(false)} className="text-xs text-gray-500">
                                취소
                            </button>
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoUpload}
                            className="w-full text-sm border rounded p-1"
                        />
                    </div>
                ) : (
                    <button onClick={() => setShowPhotoUpload(true)}
                            className="mb-3 text-xs text-primary hover:underline">
                        사진 추가하기
                    </button>
                )}

                <div className="grid grid-cols-3 gap-1">
                    {photoAlbum.map((photo, index) => (
                        <div key={index} className="aspect-square bg-gray-100 rounded overflow-hidden">
                            <img
                                src={photo || "/placeholder.svg"}
                                alt={`Photo ${index + 1}`}
                                width={80}
                                height={80}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ))}
                </div>
                <p className="mt-2 text-xs text-right text-primary">더보기 &gt;</p>
            </div>
        )
    }

    // guestbook 위젯 컴포넌트 추가
    const GuestbookWidget = ({ widget, user }) => {
        const [guestbookMessages, setGuestbookMessages] = useState(() => {
            if (typeof window === "undefined") return []
            const saved = localStorage.getItem(`guestbook-${widget.id}`)
            return saved
                ? JSON.parse(saved)
                : [
                    {id: 1, name: "친구1", message: "안녕하세요! 잘 지내시나요?", date: "오늘"},
                    {id: 2, name: "친구2", message: "홈페이지가 너무 예쁘네요!", date: "어제"},
                ]
        })
        const [newMessage, setNewMessage] = useState("")

        const addGuestbookMessage = () => {
            if (!newMessage.trim()) return

            const newEntry = {
                id: Date.now(),
                name: user?.name || "방문자",
                message: newMessage,
                date: "방금",
            }

            const updatedMessages = [newEntry, ...guestbookMessages]
            setGuestbookMessages(updatedMessages)
            localStorage.setItem(`guestbook-${widget.id}`, JSON.stringify(updatedMessages))
            setNewMessage("")
        }

        return (
            <div className="p-4">
                <div className="space-y-3">
                    {guestbookMessages.map((entry) => (
                        <div key={entry.id} className="bg-gray-50 p-2 rounded">
                            <div className="flex justify-between">
                                <p className="text-sm font-medium">{entry.name}</p>
                                <p className="text-xs text-gray-500">{entry.date}</p>
                            </div>
                            <p className="text-sm mt-1">{entry.message}</p>
                        </div>
                    ))}
                </div>
                <div className="mt-3 flex">
                    <input
                        type="text"
                        placeholder="방명록을 남겨보세요"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="flex-grow text-sm p-2 border border-gray-300 rounded-l focus:outline-none focus:ring-1 focus:ring-primary"
                        onKeyPress={(e) => e.key === "Enter" && addGuestbookMessage()}
                    />
                    <button className="bg-primary text-white px-3 py-2 rounded-r text-sm" onClick={addGuestbookMessage}>
                        등록
                    </button>
                </div>
            </div>
        )
    }

    // memo 위젯 컴포넌트 추가
    const MemoWidget = ({ widget }) => {
        const [memoText, setMemoText] = useState(() => {
            if (typeof window === "undefined") return ""
            return localStorage.getItem(`memo-${widget.id}`) || ""
        })
        const [isMemoSaved, setIsMemoSaved] = useState(true)

        const saveMemo = () => {
            localStorage.setItem(`memo-${widget.id}`, memoText)
            setIsMemoSaved(true)
            alert("메모가 저장되었습니다.")
        }

        return (
            <div className="p-4">
        <textarea
            className="w-full p-2 border rounded-md bg-yellow-50"
            rows={4}
            placeholder="메모를 작성해보세요..."
            value={memoText}
            onChange={(e) => {
                setMemoText(e.target.value)
                setIsMemoSaved(false)
            }}
        ></textarea>
                <div className="flex justify-end mt-2">
                    <button
                        className={`px-3 py-1 ${isMemoSaved ? "bg-gray-400" : "bg-primary"} text-white rounded-md text-sm`}
                        onClick={saveMemo}
                        disabled={isMemoSaved}
                    >
                        {isMemoSaved ? "저장됨" : "저장"}
                    </button>
                </div>
            </div>
        )
    }

    // dday 위젯 컴포넌트 추가
    const DdayWidget = ({ widget }) => {
        const [ddayTitle, setDdayTitle] = useState(() => {
            if (typeof window === "undefined") return "봄 콘서트"
            return localStorage.getItem(`dday-title-${widget.id}`) || "봄 콘서트"
        })
        const [ddayDate, setDdayDate] = useState(() => {
            if (typeof window === "undefined") return "2024-03-15"
            return localStorage.getItem(`dday-date-${widget.id}`) || "2024-03-15"
        })
        const [ddayTime, setDdayTime] = useState(() => {
            if (typeof window === "undefined") return "19:00"
            return localStorage.getItem(`dday-time-${widget.id}`) || "19:00"
        })
        const [ddayLocation, setDdayLocation] = useState(() => {
            if (typeof window === "undefined") return "예술의전당 콘서트홀"
            return localStorage.getItem(`dday-location-${widget.id}`) || "예술의전당 콘서트홀"
        })
        const [isEditingDday, setIsEditingDday] = useState(false)

        // D-day 계산
        const calculateDday = () => {
            const targetDate = new Date(ddayDate)
            const today = new Date()
            today.setHours(0, 0, 0, 0)
            const diffTime = targetDate.getTime() - today.getTime()
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

            if (diffDays > 0) return `D-${diffDays}`
            if (diffDays === 0) return "D-Day"
            return `D+${Math.abs(diffDays)}`
        }

        const saveDday = () => {
            localStorage.setItem(`dday-title-${widget.id}`, ddayTitle)
            localStorage.setItem(`dday-date-${widget.id}`, ddayDate)
            localStorage.setItem(`dday-time-${widget.id}`, ddayTime)
            localStorage.setItem(`dday-location-${widget.id}`, ddayLocation)
            setIsEditingDday(false)
        }

        return (
            <div className="p-4">
                {isEditingDday ? (
                    <div className="space-y-2">
                        <div>
                            <label className="text-xs text-gray-600">제목</label>
                            <input
                                type="text"
                                value={ddayTitle}
                                onChange={(e) => setDdayTitle(e.target.value)}
                                className="w-full px-2 py-1 text-sm border rounded"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-gray-600">날짜</label>
                            <input
                                type="date"
                                value={ddayDate}
                                onChange={(e) => setDdayDate(e.target.value)}
                                className="w-full px-2 py-1 text-sm border rounded"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-gray-600">시간</label>
                            <input
                                type="time"
                                value={ddayTime}
                                onChange={(e) => setDdayTime(e.target.value)}
                                className="w-full px-2 py-1 text-sm border rounded"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-gray-600">장소</label>
                            <input
                                type="text"
                                value={ddayLocation}
                                onChange={(e) => setDdayLocation(e.target.value)}
                                className="w-full px-2 py-1 text-sm border rounded"
                            />
                        </div>
                        <div className="flex justify-end space-x-2">
                            <button onClick={() => setIsEditingDday(false)}
                                    className="px-2 py-1 text-xs border rounded">
                                취소
                            </button>
                            <button onClick={saveDday} className="px-2 py-1 text-xs bg-primary text-white rounded">
                                저장
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="bg-primary/10 p-3 rounded">
                        <div className="flex justify-between items-center mb-2">
                            <p className="font-medium">{ddayTitle}</p>
                            <p className="text-lg font-bold text-primary">{calculateDday()}</p>
                        </div>
                        <p className="text-sm text-gray-600">
                            {ddayDate.replace(/-/g, ".")} {ddayTime}
                        </p>
                        <p className="text-sm text-gray-600">{ddayLocation}</p>
                        <button onClick={() => setIsEditingDday(true)}
                                className="mt-2 text-xs text-primary hover:underline">
                            수정
                        </button>
                    </div>
                )}
            </div>
        )
    }

    // posts 위젯 컴포넌트 추가
    const PostsWidget = ({ setMounted }) => {
        // 게시물 데이터 초기화 (실제 앱에서는 필요 없을 수 있음)
        useEffect(() => {
            if (!localStorage.getItem("posts")) {
                localStorage.setItem("posts", JSON.stringify(samplePosts));
            }

            // setMounted를 사용하여 상태 업데이트
            setMounted(true);  // 예시로 컴포넌트가 마운트된 후 상태를 변경하는 코드
        }, [setMounted]);

        // 로컬 스토리지에서 게시물 데이터 가져오기
        const [posts, setPosts] = useState(() => {
            if (typeof window === "undefined") return []
            return JSON.parse(localStorage.getItem("posts") || "[]")
        })

        const handleDeletePost = (postId) => {
            if (confirm("정말 이 게시물을 삭제하시겠습니까?")) {
                // 게시물 삭제 로직
                const updatedPosts = posts.filter((p) => p.id !== postId);
                localStorage.setItem("posts", JSON.stringify(updatedPosts))
                setPosts(updatedPosts)
                alert("게시물이 삭제되었습니다.")
            }
        }

        return (
            <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-base font-medium">내 게시물</h3>
                    <Link to="/posts/create" className="text-xs text-primary hover:underline">
                        새 게시물 작성
                    </Link>
                </div>

                {/* 게시물 목록 */}
                <div className="space-y-3">
                    {posts.length === 0 ? (
                        <p className="text-sm text-gray-500 text-center py-4">작성한 게시물이 없습니다.</p>
                    ) : (
                        posts.map((post, index) => (
                            <div key={index} className="border-b pb-3">
                                <div className="flex justify-between">
                                    <h4 className="font-medium text-sm">{post.title}</h4>
                                    <span className="text-xs text-gray-500">{post.date}</span>
                                </div>
                                <p className="text-xs text-gray-600 line-clamp-1 mt-1">{post.content}</p>
                                <div className="flex gap-2 mt-2">
                                    <Link to={`/posts/edit/${post.id}`}
                                          className="text-xs text-blue-600 hover:underline">
                                        수정
                                    </Link>
                                    <button className="text-xs text-red-600 hover:underline"
                                            onClick={() => handleDeletePost(post.id)}>
                                        삭제
                                    </button>
                                    <Link to={`/detail/${post.id}`} className="text-xs text-gray-600 hover:underline">
                                        보기
                                    </Link>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* 게시물 미리보기 */}
                {posts.length > 0 && (
                    <div className="mt-6">
                        <h4 className="text-sm font-medium mb-3">최근 게시물 미리보기</h4>
                        <div className="border rounded-lg overflow-hidden">
                            <div className="flex flex-col md:flex-row">
                                <div className="md:w-1/3">
                                    <img
                                        src={posts[0].image || "/placeholder.svg?height=300&width=400&text=NoImage"}
                                        alt={posts[0].title}
                                        width={400}
                                        height={300}
                                        className="w-full h-auto object-cover"
                                    />
                                </div>
                                <div className="p-4 md:w-2/3">
                                    <h3 className="text-lg font-bold mb-2">{posts[0].title}</h3>
                                    <p className="text-sm text-gray-500 mb-2">{posts[0].date}</p>
                                    <p className="text-sm line-clamp-3">{posts[0].content}</p>
                                    <div className="mt-3 flex items-center gap-4">
                                        <button className="flex items-center text-gray-500 text-sm">
                                            <Heart className="w-4 h-4 mr-1"/> 좋아요
                                        </button>
                                        <button className="flex items-center text-gray-500 text-sm">
                                            <MessageSquare className="w-4 h-4 mr-1"/> 댓글
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        )
    }

    // renderWidgetContent 함수 수정
    const renderWidgetContent = (widget) => {
        switch (widget.type) {
            case "today":
                return (
                    <div className="p-4">
                        <p className="text-sm text-gray-600">오늘의 기분</p>
                        <div className="flex items-center mt-2">
                            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                                <span className="text-xl">😊</span>
                            </div>
                            <p className="ml-3 text-sm">행복해요!</p>
                        </div>
                        <p className="mt-3 text-sm text-gray-600">
                            {new Date().toLocaleDateString("ko-KR", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                weekday: "long",
                            })}
                        </p>
                    </div>
                )

            case "visitors":
                return (
                    <div className="p-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-sm text-gray-600">오늘 방문자</p>
                                <p className="text-xl font-bold">5</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">전체 방문자</p>
                                <p className="text-xl font-bold">128</p>
                            </div>
                        </div>
                        <div className="mt-3 text-xs text-gray-500">
                            <p>최근 방문자: 친구1, 친구2, 친구3</p>
                        </div>
                    </div>
                )

            case "photos":
                return <PhotosWidget widget={widget}/>

            case "music":
                return (
                    <div className="p-4">
                        {/* Song selection dropdown */}
                        <div className="mb-3">
                            <label htmlFor="song-select" className="text-xs text-gray-600 mb-1 block">
                                노래 선택하기
                            </label>
                            <select
                                id="song-select"
                                className="w-full text-sm p-1.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary"
                                onChange={(e) => {
                                    // Save selected song to localStorage
                                    const songIndex = Number(e.target.value)
                                    localStorage.setItem("selectedSongIndex", songIndex.toString())

                                    // Force re-render by updating a timestamp in localStorage
                                    localStorage.setItem("musicWidgetUpdated", Date.now().toString())

                                    // Force the component to re-render
                                    setMounted(false)
                                    setTimeout(() => setMounted(true), 0)
                                }}
                                defaultValue={localStorage.getItem("selectedSongIndex") || "0"}
                            >
                                <option value="0">🎵 IU - Celebrity</option>
                                <option value="1">🎵 BTS - Dynamite</option>
                                <option value="2">🎵 NewJeans - Ditto</option>
                                <option value="3">🎵 aespa - Next Level</option>
                                <option value="4">🎵 Seventeen - Super</option>
                                <option value="5">🎵 LeeYoungJi - Laundry</option>
                                <option value="6">➕ 음악 추가...</option>
                            </select>
                        </div>

                        {/* Current song player */}
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-gray-200 rounded flex-shrink-0">
                                <img
                                    src={`/placeholder.svg?height=48&width=48&text=Album${localStorage.getItem("selectedSongIndex") || "0"}`}
                                    alt="Album cover"
                                    width={48}
                                    height={48}
                                    className="w-full h-full object-cover rounded"
                                />
                            </div>
                            <div className="ml-3 flex-grow">
                                <p className="text-sm font-medium">
                                    {(() => {
                                        const songIndex = Number(localStorage.getItem("selectedSongIndex") || "0")
                                        switch (songIndex) {
                                            case 0:
                                                return "Celebrity"
                                            case 1:
                                                return "Dynamite"
                                            case 2:
                                                return "Ditto"
                                            case 3:
                                                return "Next Level"
                                            case 4:
                                                return "Super"
                                            case 5:
                                                return "Laundry"
                                            case 6:
                                                return "사용자 지정 음악"
                                            default:
                                                return "노래 제목"
                                        }
                                    })()}
                                </p>
                                <p className="text-xs text-gray-600">
                                    {(() => {
                                        const songIndex = Number(localStorage.getItem("selectedSongIndex") || "0")
                                        switch (songIndex) {
                                            case 0:
                                                return "IU"
                                            case 1:
                                                return "BTS"
                                            case 2:
                                                return "NewJeans"
                                            case 3:
                                                return "aespa"
                                            case 4:
                                                return "Seventeen"
                                            case 5:
                                                return "이영지"
                                            case 6:
                                                return "아티스트"
                                            default:
                                                return "아티스트"
                                        }
                                    })()}
                                </p>
                                <div className="mt-1 h-1 bg-gray-200 rounded-full">
                                    <div className="h-full w-1/3 bg-primary rounded-full"></div>
                                </div>
                            </div>
                            <button
                                className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white">
                                <Play className="w-4 h-4"/>
                            </button>
                        </div>

                        {/* Custom song input (only shown when "음악 추가..." is selected) */}
                        {Number(localStorage.getItem("selectedSongIndex")) === 6 && (
                            <div className="mt-3 space-y-2">
                                <input
                                    type="text"
                                    className="w-full text-sm p-1.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary"
                                    placeholder="노래 제목 입력"
                                    onChange={(e) => localStorage.setItem("customSongTitle", e.target.value)}
                                    defaultValue={localStorage.getItem("customSongTitle") || ""}
                                />
                                <input
                                    type="text"
                                    className="w-full text-sm p-1.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary"
                                    placeholder="아티스트 입력"
                                    onChange={(e) => localStorage.setItem("customSongArtist", e.target.value)}
                                    defaultValue={localStorage.getItem("customSongArtist") || ""}
                                />
                                <div className="flex justify-end">
                                    <button
                                        onClick={() => {
                                            // Force re-render by updating a timestamp in localStorage
                                            localStorage.setItem("musicWidgetUpdated", Date.now().toString())

                                            // Force the component to re-render
                                            setMounted(false)
                                            setTimeout(() => setMounted(true), 0)
                                        }}
                                        className="px-2 py-1 bg-primary text-white rounded text-xs"
                                    >
                                        적용
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Recently played */}
                        <div className="mt-3">
                            <p className="text-xs text-gray-600 mb-1">최근 재생 목록</p>
                            <div className="space-y-1">
                                <div className="flex items-center text-xs p-1 hover:bg-gray-100 rounded cursor-pointer">
                                    <div className="w-5 h-5 bg-gray-200 rounded mr-2"></div>
                                    <div className="flex-grow">
                                        <p className="font-medium">Cupid</p>
                                        <p className="text-gray-500">FIFTY FIFTY</p>
                                    </div>
                                </div>
                                <div className="flex items-center text-xs p-1 hover:bg-gray-100 rounded cursor-pointer">
                                    <div className="w-5 h-5 bg-gray-200 rounded mr-2"></div>
                                    <div className="flex-grow">
                                        <p className="font-medium">Kitsch</p>
                                        <p className="text-gray-500">IXSPA</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )

            case "guestbook":
                return <GuestbookWidget widget={widget} user={user}/>

            case "calendar":
                return (
                    <div className="p-4">
                        <div className="text-center">
                            <p className="font-medium">
                                {new Date().getFullYear()}년 {new Date().getMonth() + 1}월
                            </p>
                            <div className="grid grid-cols-7 gap-1 mt-2">
                                {["일", "월", "화", "수", "목", "금", "토"].map((day, i) => (
                                    <div key={i} className="text-xs font-medium">
                                        {day}
                                    </div>
                                ))}
                                {[...Array(31)].map((_, i) => (
                                    <div
                                        key={i}
                                        className={`text-xs p-1 ${i + 1 === new Date().getDate() ? "bg-primary text-white rounded-full" : ""}`}
                                    >
                                        {i + 1}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )

            case "memo":
                return <MemoWidget widget={widget}/>

            case "weather":
                return (
                    <div className="p-4">
                        <div className="flex items-center justify-between bg-blue-50 p-3 rounded">
                            <div>
                                <p className="font-medium">예술의전당 (3월 15일)</p>
                                <p className="text-sm text-gray-600">서울특별시 서초구</p>
                            </div>
                            <div className="flex flex-col items-center">
                                <Sun className="w-8 h-8 text-yellow-500"/>
                                <p className="text-lg font-bold">18°C</p>
                            </div>
                        </div>
                    </div>
                )

            case "dday":
                return <DdayWidget widget={widget}/>

            case "trophy":
                return (
                    <div className="p-4">
                        <div className="grid grid-cols-3 gap-2">
                            <div className="flex flex-col items-center">
                                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
                                    <Award className="w-8 h-8 text-yellow-500"/>
                                </div>
                                <p className="text-xs text-center mt-1">2023 신인상</p>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                                    <Award className="w-8 h-8 text-gray-400"/>
                                </div>
                                <p className="text-xs text-center mt-1">우수 연주자상</p>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
                                    <Award className="w-8 h-8 text-amber-700"/>
                                </div>
                                <p className="text-xs text-center mt-1">인기상</p>
                            </div>
                        </div>
                    </div>
                )

            case "stats":
                return (
                    <div className="p-4">
                        <div className="bg-white p-2 rounded border">
                            <p className="text-sm font-medium mb-2">2023년 공연 관람객 수</p>
                            <div className="space-y-2">
                                <div>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span>봄 콘서트</span>
                                        <span>450명</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div className="bg-primary h-2 rounded-full" style={{width: "90%"}}></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span>여름 페스티벌</span>
                                        <span>380명</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div className="bg-primary h-2 rounded-full" style={{width: "76%"}}></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span>가을 공연</span>
                                        <span>420명</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div className="bg-primary h-2 rounded-full" style={{width: "84%"}}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )

            case "posts":
                return <PostsWidget setMounted={setMounted}/>

            default:
                return <div className="p-4">위젯 내용</div>
        }
    }

    // Redirect to login page if not logged in
    useEffect(() => {
        if (!isLoading && !user) {
            navigate("/login")
        }
    }, [user, isLoading, navigate])

    const handleLogout = () => {
        logout()
        navigate("/")
    }

    // Don't render if loading or not logged in
    if (isLoading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div
                        className="w-12 h-12 border-t-4 border-primary border-solid rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">로딩 중...</p>
                </div>
            </div>
        )
    }

    // const isColorDark = (color) => {
    //     const hex = color.replace("#", "")
    //     const r = Number.parseInt(hex.substr(0, 2), 16)
    //     const g = Number.parseInt(hex.substr(2, 2), 16)
    //     const b = Number.parseInt(hex.substr(4, 2), 16)
    //     const brightness = (r * 299 + g * 587 + b * 114) / 1000
    //     return brightness < 128
    // }

    const pageStyle = {
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
    }

    // 위젯 배경색 가져오기
    const getWidgetBackgroundColor = (widget) => {
        if (!widget.backgroundColor || widget.backgroundColor === "white") {
            return "bg-white"
        }

        if (widget.backgroundColor.startsWith("bg-")) {
            return widget.backgroundColor
        }

        if (widget.backgroundColor.startsWith("custom-")) {
            return `bg-[#${widget.backgroundColor.slice(7)}]`
        }

        return "bg-white"
    }

    // 위젯 텍스트 색상 가져오기 함수 수정
    const getWidgetTextColor = (widget) => {
        if (!widget.textColor) {
            return "text-gray-900"
        }

        if (widget.textColor.startsWith("custom-text-")) {
            return `text-[#${widget.textColor.slice(12)}]`
        }

        return widget.textColor
    }

    // 위젯 헤더 텍스트 색상 가져오기 함수 추가
    const getWidgetHeaderTextColor = (widget) => {
        if (!widget.headerTextColor) {
            return "text-white"
        }

        if (widget.headerTextColor.startsWith("custom-text-")) {
            return `text-[#${widget.headerTextColor.slice(12)}]`
        }

        return widget.headerTextColor
    }

    return (
        <div
            className={`min-h-screen flex flex-col ${
                skinColor.startsWith("custom-") ? `bg-[#${skinColor.slice(7)}]` : `bg-${skinColor}`
            } ${
                localStorage.getItem("user_skin_text")
                    ? localStorage.getItem("user_skin_text")?.startsWith("custom-text-")
                        ? `text-[#${localStorage.getItem("user_skin_text")?.slice(12)}]`
                        : localStorage.getItem("user_skin_text")
                    : skinColor === "gray-800"
                        ? "text-white"
                        : "text-gray-900"
            }`}
            style={pageStyle}
        >
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Link to="/" className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-primary mr-2"></div>
                            <span className="text-xl font-bold">art U</span>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main content */}
            <main className="flex-grow container mx-auto px-4 py-8">
                <div className="max-w-6xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-2xl font-bold">
                            {typeof window !== "undefined" && localStorage.getItem("user_name")
                                ? `${localStorage.getItem("user_name")}님의 페이지`
                                : `${user.name}님의 페이지`}
                        </h1>
                        <div className="flex items-center space-x-2">
                            {isCustomizing && (
                                <>
                                    <button
                                        onClick={() => setShowTemplateSelector(!showTemplateSelector)}
                                        className="flex items-center px-3 py-1.5 rounded text-sm bg-blue-500 text-white hover:bg-blue-600"
                                    >
                                        템플릿 적용
                                    </button>
                                    <button
                                        onClick={() => setShowPositionControls(!showPositionControls)}
                                        className="flex items-center px-3 py-1.5 rounded text-sm bg-purple-500 text-white hover:bg-purple-600"
                                    >
                                        위치 조정
                                    </button>
                                    <button
                                        onClick={() => setShowColorControls(!showColorControls)}
                                        className="flex items-center px-3 py-1.5 rounded text-sm bg-green-500 text-white hover:bg-green-600"
                                    >
                                        위젯 색상
                                    </button>
                                    <button
                                        onClick={() => setShowSkinSelector(!showSkinSelector)}
                                        className="flex items-center px-3 py-1.5 rounded text-sm bg-amber-500 text-white hover:bg-amber-600"
                                    >
                                        스킨 변경
                                    </button>
                                </>
                            )}
                            <button
                                onClick={toggleCustomizing}
                                className={`flex items-center px-3 py-1.5 rounded text-sm ${
                                    isCustomizing ? "bg-green-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                            >
                                {isCustomizing ? (
                                    <>
                                        <Save className="w-4 h-4 mr-1"/>
                                        꾸미기 완료
                                    </>
                                ) : (
                                    <>
                                        <Pencil className="w-4 h-4 mr-1"/>
                                        미니홈피 꾸미기
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* 템플릿 선택기 */}
                    {showTemplateSelector && isCustomizing && (
                        <div className="bg-white rounded-lg shadow p-4 mb-6">
                            <h3 className="text-lg font-medium mb-3">템플릿 선택</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <button
                                    onClick={() => applyTemplate("standard")}
                                    className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <h4 className="font-medium mb-2">기본 템플릿</h4>
                                    <p className="text-sm text-gray-600">투데이, 방문자, 사진첩, 음악 위젯이 포함된 기본 레이아웃</p>
                                </button>
                                <button
                                    onClick={() => applyTemplate("blog")}
                                    className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <h4 className="font-medium mb-2">블로그 템플릿</h4>
                                    <p className="text-sm text-gray-600">게시물 위주로 구성된 블로그 스타일 레이아웃</p>
                                </button>
                                <button
                                    onClick={() => applyTemplate("dashboard")}
                                    className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <h4 className="font-medium mb-2">대시보드 템플릿</h4>
                                    <p className="text-sm text-gray-600">통계, 캘린더, D-day, 트로피 위젯이 포함된 대시보드 레이아웃</p>
                                </button>
                            </div>
                            <div className="mt-4 text-sm text-gray-500">
                                <p>※ 템플릿을 적용하면 기존 레이아웃이 변경됩니다.</p>
                            </div>
                        </div>
                    )}

                    {/* 스킨 선택기 */}
                    {showSkinSelector && isCustomizing && (
                        <div className="bg-white rounded-lg shadow p-4 mb-6">
                            <h3 className="text-lg font-medium mb-3">스킨 선택</h3>
                            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                                {skinOptions.map((skin) => (
                                    <button
                                        key={skin.value}
                                        onClick={() => (skin.value === "custom" ? null : saveSkinPreference(skin.value))}
                                        className={`p-4 h-20 rounded-lg flex items-center justify-center ${
                                            skinColor === skin.value ? "ring-2 ring-primary" : ""
                                        } ${skin.value !== "custom" ? `bg-${skin.value}` : ""} ${skin.textColor}`}
                                    >
                                        {skin.name}
                                    </button>
                                ))}
                            </div>
                            <div className="mt-4">
                                <h4 className="text-md font-medium mb-2">사용자 정의 색상</h4>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="color"
                                        value={customColor}
                                        onChange={handleCustomColorChange}
                                        className="w-10 h-10 rounded"
                                    />
                                    <input
                                        type="text"
                                        value={customColor}
                                        onChange={handleCustomColorChange}
                                        className="border rounded px-2 py-1 w-24"
                                    />
                                    <button
                                        onClick={applyCustomColor}
                                        className="px-3 py-1 bg-primary text-white rounded hover:bg-primary/90"
                                    >
                                        적용
                                    </button>
                                </div>
                            </div>
                            <div className="mt-4">
                                <h4 className="text-md font-medium mb-2">스킨 텍스트 색상</h4>
                                <div className="grid grid-cols-3 md:grid-cols-7 gap-4 mb-4">
                                    {textColorPresets.map((preset) => (
                                        <button
                                            key={preset.name}
                                            onClick={() => {
                                                const currentSkin = skinColor.startsWith("custom-") ? `custom-${skinColor.slice(7)}` : skinColor
                                                saveSkinPreference(`${currentSkin}|${preset.value}`)
                                            }}
                                            className={`p-3 h-12 rounded-lg flex items-center justify-center ${preset.bgColor} border ${preset.value}`}
                                        >
                                            {preset.name}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="color"
                                        value={customSkinTextColor}
                                        onChange={(e) => setCustomSkinTextColor(e.target.value)}
                                        className="w-10 h-10 rounded"
                                    />
                                    <input
                                        type="text"
                                        value={customSkinTextColor}
                                        onChange={(e) => setCustomSkinTextColor(e.target.value)}
                                        className="border rounded px-2 py-1 w-24"
                                    />
                                    <button
                                        onClick={() => {
                                            const currentSkin = skinColor.startsWith("custom-") ? `custom-${skinColor.slice(7)}` : skinColor
                                            saveSkinPreference(`${currentSkin}|custom-text-${customSkinTextColor.replace("#", "")}`)
                                        }}
                                        className="px-3 py-1 bg-primary text-white rounded hover:bg-primary/90"
                                    >
                                        적용
                                    </button>
                                </div>
                            </div>
                            <div className="mt-4">
                                <h4 className="text-md font-medium mb-2">배경 이미지 설정</h4>
                                <div className="flex items-center space-x-2 mb-2">
                                    <label
                                        htmlFor="background-image-upload"
                                        className="cursor-pointer bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                    >
                                        <Upload className="w-4 h-4 inline-block mr-1"/>
                                        이미지 업로드
                                    </label>
                                    <input
                                        id="background-image-upload"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleBackgroundImageUpload}
                                        className="hidden"
                                    />
                                    <button
                                        onClick={removeBackgroundImage}
                                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                    >
                                        이미지 제거
                                    </button>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="text"
                                        value={backgroundImageUrl}
                                        onChange={handleBackgroundImageUrlChange}
                                        placeholder="이미지 URL 입력"
                                        className="border rounded px-2 py-1 flex-grow"
                                    />
                                    <button
                                        onClick={applyBackgroundImageUrl}
                                        className="px-3 py-1 bg-primary text-white rounded hover:bg-primary/90"
                                    >
                                        URL 적용
                                    </button>
                                </div>
                            </div>
                            <div className="mt-4 text-sm text-gray-500">
                                <p>※ 스킨을 변경하면 미니홈피의 배경색이나 이미지가 변경됩니다.</p>
                            </div>
                        </div>
                    )}

                    {/* 위젯 색상 선택기 */}
                    {showColorControls && isCustomizing && selectedWidgetId && (
                        <div className="bg-white rounded-lg shadow p-4 mb-6">
                            <h3 className="text-lg font-medium mb-3">위젯 색상 설정</h3>
                            <p className="text-sm text-gray-600 mb-4">
                                선택된 위젯: {widgets.find((w) => w.id === selectedWidgetId)?.title}
                            </p>

                            <div className="mb-6">
                                <h4 className="text-md font-medium mb-2">위젯 본문 색상</h4>
                                <div className="grid grid-cols-3 md:grid-cols-7 gap-4 mb-4">
                                    {widgetColorPresets.map((preset) => (
                                        <button
                                            key={preset.name}
                                            onClick={() => updateWidgetColor(selectedWidgetId, preset.backgroundColor, preset.textColor)}
                                            className={`p-3 h-16 rounded-lg flex items-center justify-center ${
                                                preset.backgroundColor !== "white" ? preset.backgroundColor : "bg-white border"
                                            } ${preset.textColor}`}
                                        >
                                            {preset.name}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="color"
                                        value={customWidgetColor}
                                        onChange={handleCustomWidgetColorChange}
                                        className="w-10 h-10 rounded"
                                    />
                                    <input
                                        type="text"
                                        value={customWidgetColor}
                                        onChange={handleCustomWidgetColorChange}
                                        className="border rounded px-2 py-1 w-24"
                                    />
                                    <button
                                        onClick={() =>
                                            updateWidgetColor(selectedWidgetId, `custom-${customWidgetColor.replace("#", "")}`, "")
                                        }
                                        className="px-3 py-1 bg-primary text-white rounded hover:bg-primary/90"
                                    >
                                        적용
                                    </button>
                                </div>
                            </div>

                            <div className="mt-4 mb-4">
                                <h4 className="text-md font-medium mb-2">위젯 본문 텍스트 색상</h4>
                                <div className="grid grid-cols-3 md:grid-cols-7 gap-4 mb-4">
                                    {textColorPresets.map((preset) => (
                                        <button
                                            key={preset.name}
                                            onClick={() =>
                                                updateWidgetColor(
                                                    selectedWidgetId,
                                                    widgets.find((w) => w.id === selectedWidgetId)?.backgroundColor || "white",
                                                    preset.value,
                                                    widgets.find((w) => w.id === selectedWidgetId)?.headerBackgroundColor || "bg-primary",
                                                    widgets.find((w) => w.id === selectedWidgetId)?.headerTextColor || "text-white",
                                                )
                                            }
                                            className={`p-3 h-12 rounded-lg flex items-center justify-center ${preset.bgColor} border ${preset.value}`}
                                        >
                                            {preset.name}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="color"
                                        value={customWidgetTextColor}
                                        onChange={(e) => setCustomWidgetTextColor(e.target.value)}
                                        className="w-10 h-10 rounded"
                                    />
                                    <input
                                        type="text"
                                        value={customWidgetTextColor}
                                        onChange={(e) => setCustomWidgetTextColor(e.target.value)}
                                        className="border rounded px-2 py-1 w-24"
                                    />
                                    <button
                                        onClick={() =>
                                            updateWidgetColor(
                                                selectedWidgetId,
                                                widgets.find((w) => w.id === selectedWidgetId)?.backgroundColor || "white",
                                                `custom-text-${customWidgetTextColor.replace("#", "")}`,
                                                widgets.find((w) => w.id === selectedWidgetId)?.headerBackgroundColor || "bg-primary",
                                                widgets.find((w) => w.id === selectedWidgetId)?.headerTextColor || "text-white",
                                            )
                                        }
                                        className="px-3 py-1 bg-primary text-white rounded hover:bg-primary/90"
                                    >
                                        적용
                                    </button>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-md font-medium mb-2">위젯 헤더 색상</h4>
                                <div className="grid grid-cols-3 md:grid-cols-7 gap-4 mb-4">
                                    <button
                                        onClick={() =>
                                            updateWidgetColor(
                                                selectedWidgetId,
                                                widgets.find((w) => w.id === selectedWidgetId)?.backgroundColor || "white",
                                                widgets.find((w) => w.id === selectedWidgetId)?.textColor || "text-gray-900",
                                                "bg-primary",
                                                "text-white",
                                            )
                                        }
                                        className="p-3 h-16 rounded-lg flex items-center justify-center bg-primary text-white"
                                    >
                                        기본
                                    </button>
                                    <button
                                        onClick={() =>
                                            updateWidgetColor(
                                                selectedWidgetId,
                                                widgets.find((w) => w.id === selectedWidgetId)?.backgroundColor || "white",
                                                widgets.find((w) => w.id === selectedWidgetId)?.textColor || "text-gray-900",
                                                "bg-blue-500",
                                                "text-white",
                                            )
                                        }
                                        className="p-3 h-16 rounded-lg flex items-center justify-center bg-blue-500 text-white"
                                    >
                                        블루
                                    </button>
                                    <button
                                        onClick={() =>
                                            updateWidgetColor(
                                                selectedWidgetId,
                                                widgets.find((w) => w.id === selectedWidgetId)?.backgroundColor || "white",
                                                widgets.find((w) => w.id === selectedWidgetId)?.textColor || "text-gray-900",
                                                "bg-green-500",
                                                "text-white",
                                            )
                                        }
                                        className="p-3 h-16 rounded-lg flex items-center justify-center bg-green-500 text-white"
                                    >
                                        그린
                                    </button>
                                    <button
                                        onClick={() =>
                                            updateWidgetColor(
                                                selectedWidgetId,
                                                widgets.find((w) => w.id === selectedWidgetId)?.backgroundColor || "white",
                                                widgets.find((w) => w.id === selectedWidgetId)?.textColor || "text-gray-900",
                                                "bg-purple-500",
                                                "text-white",
                                            )
                                        }
                                        className="p-3 h-16 rounded-lg flex items-center justify-center bg-purple-500 text-white"
                                    >
                                        퍼플
                                    </button>
                                    <button
                                        onClick={() =>
                                            updateWidgetColor(
                                                selectedWidgetId,
                                                widgets.find((w) => w.id === selectedWidgetId)?.backgroundColor || "white",
                                                widgets.find((w) => w.id === selectedWidgetId)?.textColor || "text-gray-900",
                                                "bg-pink-500",
                                                "text-white",
                                            )
                                        }
                                        className="p-3 h-16 rounded-lg flex items-center justify-center bg-pink-500 text-white"
                                    >
                                        핑크
                                    </button>
                                    <button
                                        onClick={() =>
                                            updateWidgetColor(
                                                selectedWidgetId,
                                                widgets.find((w) => w.id === selectedWidgetId)?.backgroundColor || "white",
                                                widgets.find((w) => w.id === selectedWidgetId)?.textColor || "text-gray-900",
                                                "bg-yellow-500",
                                                "text-white",
                                            )
                                        }
                                        className="p-3 h-16 rounded-lg flex items-center justify-center bg-yellow-500 text-white"
                                    >
                                        옐로우
                                    </button>
                                    <button
                                        onClick={() =>
                                            updateWidgetColor(
                                                selectedWidgetId,
                                                widgets.find((w) => w.id === selectedWidgetId)?.backgroundColor || "white",
                                                widgets.find((w) => w.id === selectedWidgetId)?.textColor || "text-gray-900",
                                                "bg-gray-800",
                                                "text-white",
                                            )
                                        }
                                        className="p-3 h-16 rounded-lg flex items-center justify-center bg-gray-800 text-white"
                                    >
                                        다크
                                    </button>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="color"
                                        value={customHeaderColor || "#6366F1"}
                                        onChange={(e) => setCustomHeaderColor(e.target.value)}
                                        className="w-10 h-10 rounded"
                                    />
                                    <input
                                        type="text"
                                        value={customHeaderColor || "#6366F1"}
                                        onChange={(e) => setCustomHeaderColor(e.target.value)}
                                        className="border rounded px-2 py-1 w-24"
                                    />
                                    <button
                                        onClick={() =>
                                            updateWidgetColor(
                                                selectedWidgetId,
                                                widgets.find((w) => w.id === selectedWidgetId)?.backgroundColor || "white",
                                                widgets.find((w) => w.id === selectedWidgetId)?.textColor || "text-gray-900",
                                                `custom-${customHeaderColor?.replace("#", "")}`,
                                                "text-white",
                                            )
                                        }
                                        className="px-3 py-1 bg-primary text-white rounded hover:bg-primary/90"
                                    >
                                        적용
                                    </button>
                                </div>
                            </div>

                            <div className="mt-4 mb-4">
                                <h4 className="text-md font-medium mb-2">위젯 헤더 텍스트 색상</h4>
                                <div className="grid grid-cols-3 md:grid-cols-7 gap-4 mb-4">
                                    {textColorPresets.map((preset) => (
                                        <button
                                            key={preset.name}
                                            onClick={() =>
                                                updateWidgetColor(
                                                    selectedWidgetId,
                                                    widgets.find((w) => w.id === selectedWidgetId)?.backgroundColor || "white",
                                                    widgets.find((w) => w.id === selectedWidgetId)?.textColor || "text-gray-900",
                                                    widgets.find((w) => w.id === selectedWidgetId)?.headerBackgroundColor || "bg-primary",
                                                    preset.value,
                                                )
                                            }
                                            className={`p-3 h-12 rounded-lg flex items-center justify-center ${preset.bgColor} border ${preset.value}`}
                                        >
                                            {preset.name}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="color"
                                        value={customHeaderTextColor}
                                        onChange={(e) => setCustomHeaderTextColor(e.target.value)}
                                        className="w-10 h-10 rounded"
                                    />
                                    <input
                                        type="text"
                                        value={customHeaderTextColor}
                                        onChange={(e) => setCustomHeaderTextColor(e.target.value)}
                                        className="border rounded px-2 py-1 w-24"
                                    />
                                    <button
                                        onClick={() =>
                                            updateWidgetColor(
                                                selectedWidgetId,
                                                widgets.find((w) => w.id === selectedWidgetId)?.backgroundColor || "white",
                                                widgets.find((w) => w.id === selectedWidgetId)?.textColor || "text-gray-900",
                                                widgets.find((w) => w.id === selectedWidgetId)?.headerBackgroundColor || "bg-primary",
                                                `custom-text-${customHeaderTextColor.replace("#", "")}`,
                                            )
                                        }
                                        className="px-3 py-1 bg-primary text-white rounded hover:bg-primary/90"
                                    >
                                        적용
                                    </button>
                                </div>
                            </div>

                            <div className="mt-4 text-sm text-gray-500">
                                <p>※ 위젯 본문과 헤더의 색상을 각각 설정할 수 있습니다.</p>
                            </div>
                        </div>
                    )}

                    {/* Customization toolbar */}
                    {isCustomizing && (
                        <div className="bg-white rounded-lg shadow p-4 mb-6">
                            <h3 className="text-lg font-medium mb-3">위젯 추가하기</h3>
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                                {availableWidgets.map((widget) => (
                                    <button
                                        key={widget.type}
                                        onClick={() => addWidget(widget.type)}
                                        className="p-2 bg-gray-100 rounded hover:bg-gray-200 flex flex-col items-center"
                                    >
                                        <div
                                            className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mb-1">
                                            {widget.icon}
                                        </div>
                                        <span className="text-xs">{widget.title}</span>
                                    </button>
                                ))}
                            </div>
                            <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm">
                                <p className="flex items-center text-blue-700">
                                    <Move className="w-4 h-4 mr-2"/>
                                    위젯을 클릭하여 선택한 후 위치 조정 버튼을 사용하세요
                                </p>
                                <p className="flex items-center text-blue-700 mt-2">
                                    <Palette className="w-4 h-4 mr-2"/>
                                    위젯 색상 버튼으로 각 위젯의 색상을 변경할 수 있습니다
                                </p>
                            </div>
                        </div>
                    )}

                    {/* 위치 조정 컨트롤 */}
                    {showPositionControls && isCustomizing && selectedWidgetId && (
                        <div className="bg-white rounded-lg shadow p-4 mb-6">
                            <h3 className="text-lg font-medium mb-3">위젯 위치 및 크기 조정</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="font-medium mb-2">위치 조정</h4>
                                    <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
                                        <div></div>
                                        <button
                                            onClick={() => moveWidgetUp(selectedWidgetId)}
                                            className="p-2 bg-gray-100 rounded hover:bg-gray-200 flex items-center justify-center"
                                        >
                                            <ChevronUp className="w-5 h-5"/>
                                        </button>
                                        <div></div>
                                        <button
                                            onClick={() => moveWidgetLeft(selectedWidgetId)}
                                            className="p-2 bg-gray-100 rounded hover:bg-gray-200 flex items-center justify-center"
                                        >
                                            <ChevronLeft className="w-5 h-5"/>
                                        </button>
                                        <div className="p-2 bg-gray-200 rounded flex items-center justify-center">
                                            <Move className="w-5 h-5 text-gray-600"/>
                                        </div>
                                        <button
                                            onClick={() => moveWidgetRight(selectedWidgetId)}
                                            className="p-2 bg-gray-100 rounded hover:bg-gray-200 flex items-center justify-center"
                                        >
                                            <ChevronRight className="w-5 h-5"/>
                                        </button>
                                        <div></div>
                                        <button
                                            onClick={() => moveWidgetDown(selectedWidgetId)}
                                            className="p-2 bg-gray-100 rounded hover:bg-gray-200 flex items-center justify-center"
                                        >
                                            <ChevronDown className="w-5 h-5"/>
                                        </button>
                                        <div></div>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-medium mb-2">크기 조정</h4>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm">너비:</span>
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() => decreaseWidgetWidth(selectedWidgetId)}
                                                    className="p-2 bg-gray-100 rounded hover:bg-gray-200 flex items-center justify-center"
                                                >
                                                    <Minus className="w-4 h-4"/>
                                                </button>
                                                <span className="text-sm w-8 text-center">
                          {widgets.find((w) => w.id === selectedWidgetId)?.w || 0}
                        </span>
                                                <button
                                                    onClick={() => increaseWidgetWidth(selectedWidgetId)}
                                                    className="p-2 bg-gray-100 rounded hover:bg-gray-200 flex items-center justify-center"
                                                >
                                                    <Plus className="w-4 h-4"/>
                                                </button>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm">높이:</span>
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() => decreaseWidgetHeight(selectedWidgetId)}
                                                    className="p-2 bg-gray-100 rounded hover:bg-gray-200 flex items-center justify-center"
                                                >
                                                    <Minus className="w-4 h-4"/>
                                                </button>
                                                <span className="text-sm w-8 text-center">
                          {widgets.find((w) => w.id === selectedWidgetId)?.h || 0}
                        </span>
                                                <button
                                                    onClick={() => increaseWidgetHeight(selectedWidgetId)}
                                                    className="p-2 bg-gray-100 rounded hover:bg-gray-200 flex items-center justify-center"
                                                >
                                                    <Plus className="w-4 h-4"/>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4 text-sm text-gray-500">
                                <p>선택된 위젯: {widgets.find((w) => w.id === selectedWidgetId)?.title}</p>
                            </div>
                        </div>
                    )}

                    {/* 가이드 */}
                    {showGuide && isCustomizing && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg shadow p-6 mb-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-semibold text-blue-800">미니홈피 꾸미기 가이드</h3>
                                <button onClick={() => setShowGuide(false)}
                                        className="text-blue-700 hover:text-blue-900">
                                    닫기
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-lg font-medium text-blue-700 mb-2">1. 템플릿 적용</h4>
                                    <p className="text-blue-700">
                                        미리 정의된 레이아웃 템플릿을 적용하여 빠르게 미니홈피를 꾸밀 수 있습니다.
                                    </p>
                                </div>

                                <div>
                                    <h4 className="text-lg font-medium text-blue-700 mb-2">2. 위치 조정</h4>
                                    <p className="text-blue-700">
                                        위젯을 먼저 선택한 후, 위치 조정 버튼을 사용하여 상하좌우로 이동하거나 크기를 조절할 수 있습니다.
                                    </p>
                                </div>

                                <div>
                                    <h4 className="text-lg font-medium text-blue-700 mb-2">3. 위젯 색상</h4>
                                    <p className="text-blue-700">
                                        위젯을 선택한 후, 위젯 색상 버튼을 클릭하여 배경색과 글자색을 변경할 수 있습니다. 본문과 헤더의
                                        색상을 각각 설정할 수 있습니다.
                                    </p>
                                </div>

                                <div>
                                    <h4 className="text-lg font-medium text-blue-700 mb-2">4. 스킨 변경</h4>
                                    <p className="text-blue-700">전체 미니홈피의 배경색, 글자색, 배경 이미지를 변경할 수 있습니다.</p>
                                </div>

                                <div>
                                    <h4 className="text-lg font-medium text-blue-700 mb-2">5. 위젯 추가</h4>
                                    <p className="text-blue-700">
                                        하단의 위젯 추가하기 섹션에서 원하는 위젯을 클릭하여 미니홈피에 추가할 수 있습니다.
                                    </p>
                                </div>

                                <div>
                                    <h4 className="text-lg font-medium text-blue-700 mb-2">6. 위젯 삭제</h4>
                                    <p className="text-blue-700">
                                        위젯 상단의 쓰레기통 아이콘을 클릭하여 해당 위젯을 삭제할 수 있습니다.
                                    </p>
                                </div>

                                <div>
                                    <h4 className="text-lg font-medium text-blue-700 mb-2">7. 변경사항 저장</h4>
                                    <p className="text-blue-700">"꾸미기 완료" 버튼을 클릭하면 모든 변경사항이 저장됩니다.</p>
                                </div>
                            </div>

                            <div className="mt-6 text-center">
                                <button
                                    onClick={() => setShowGuide(false)}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                >
                                    이해했어요! 시작하기
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Profile widget (always at the top) */}
                    <div className="bg-white rounded-lg shadow mb-8 p-6">
                        <div className="flex flex-col">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <div
                                        className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center relative group overflow-hidden">
                                        {localStorage.getItem("profile_picture") ? (
                                            <img
                                                src={localStorage.getItem("profile_picture") || "/placeholder.svg"}
                                                alt="프로필 사진"
                                                width={80}
                                                height={80}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <User
                                                className="w-10 h-10 text-gray-500 group-hover:text-primary transition-colors"/>
                                        )}
                                        <div
                                            className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 rounded-full flex items-center justify-center transition-all">
                      <span className="text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        수정
                      </span>
                                        </div>
                                    </div>
                                    <div className="ml-6">
                                        <h2 className="text-xl font-semibold">{user.name}</h2>
                                        <p className="text-gray-600">{user.email}</p>
                                        <p className="text-sm text-primary mt-1">
                                            <Link to="/profile/edit">프로필 수정하기</Link>
                                        </p>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <button
                                            onClick={() => window.location.to = '/settings'}
                                            className="text-sm text-primary mt-1"
                                        >
                                            설정
                                        </button>
                                        <button
                                            onClick={() => window.location.to = '/purchase'}
                                            className="text-sm text-primary mt-1"
                                        >
                                            결제 내역
                                        </button>
                                    </div>
                                </div>
                                <div className="flex space-x-6">
                                    <div className="text-center">
                                        <p className="font-bold">0</p>
                                        <p className="text-sm text-gray-600">게시물</p>
                                        <button className="text-sm text-primary mt-1" onClick={()=> window.location.to = '/posts/history'}>게시물 관리</button>
                                    </div>
                                    <div className="text-center">
                                        <p className="font-bold">0</p>
                                        <p className="text-sm text-gray-600">팔로워</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="font-bold">0</p>
                                        <p className="text-sm text-gray-600">팔로우</p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-gray-100">
                                <p className="text-gray-700">
                                    {localStorage.getItem("bio") || "자기소개가 없습니다. 프로필을 수정하여 자기소개를 작성해보세요."}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Grid Layout */}
                    <div className="mb-8">
                        {mounted && (
                            <GridLayout
                                className="layout"
                                layout={layout}
                                cols={12}
                                rowHeight={100}
                                width={1200}
                                isDraggable={isCustomizing}
                                isResizable={isCustomizing}
                                onLayoutChange={handleLayoutChange}
                                margin={[16, 16]}
                            >
                                {widgets.map((widget) => (
                                    <div
                                        key={widget.i}
                                        className={`${getWidgetBackgroundColor(widget)} ${getWidgetTextColor(widget)} rounded-lg shadow relative ${isCustomizing && selectedWidgetId === widget.id ? "ring-2 ring-primary" : ""}`}
                                        onClick={() => selectWidget(widget.id)}
                                    >
                                        {isCustomizing && (
                                            <div
                                                className={`absolute top-0 left-0 right-0 ${
                                                    widget.headerBackgroundColor
                                                        ? widget.headerBackgroundColor.startsWith("custom-")
                                                            ? `bg-[#${widget.headerBackgroundColor.slice(7)}]`
                                                            : widget.headerBackgroundColor
                                                        : "bg-primary"
                                                } ${getWidgetHeaderTextColor(widget)} p-1 text-xs flex items-center justify-between z-10`}
                                            >
                                                <div className="flex items-center">
                                                    <GripVertical className="w-3 h-3 mr-1"/>
                                                    <span>{widget.title}</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            setSelectedWidgetId(widget.id)
                                                            setShowColorControls(true)
                                                            setShowPositionControls(false)
                                                        }}
                                                        className="p-1 hover:bg-blue-600 rounded mr-1"
                                                        title="위젯 색상 변경"
                                                    >
                                                        <Palette className="w-3 h-3"/>
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            removeWidget(widget.id)
                                                        }}
                                                        className="p-1 hover:bg-red-600 rounded"
                                                    >
                                                        <Trash2 className="w-3 h-3"/>
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                        {mounted && renderWidgetContent(widget)}
                                    </div>
                                ))}
                            </GridLayout>
                        )}
                    </div>

                    {/* Logout button */}
                    <div className="text-center mt-8">
                        <button onClick={handleLogout}
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                            로그아웃
                        </button>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-gray-100 py-4">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-gray-500 text-sm">© 2024 art U. All rights reserved.</p>
                </div>
            </footer>
        </div>
    )
}