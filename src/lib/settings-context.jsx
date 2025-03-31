"use client"

import React from "react"
import { createContext, useContext, useState, useEffect } from "react"


const SettingsContext = createContext(undefined);

// 번역 데이터 가져오기
import { getTranslation } from "./translations"

export function SettingsProvider({ children }) {
    const [darkMode, setDarkMode] = useState(false)
    const [language, setLanguage] = useState("ko")
    const [notificationsEnabled, setNotificationsEnabled] = useState(true)
    const [emailNotifications, setEmailNotifications] = useState(true)
    const [marketingNotifications, setMarketingNotifications] = useState(false)
    const [autoTranslate, setAutoTranslate] = useState(true)
    const [fontSize, setFontSize] = useState("medium")

    // 로컬 스토리지에서 설정 불러오기
    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedSettings = localStorage.getItem("userSettings")
            if (storedSettings) {
                const settings = JSON.parse(storedSettings)
                setDarkMode(settings.darkMode || false)
                setLanguage(settings.language || "ko")
                setNotificationsEnabled(settings.notificationsEnabled !== undefined ? settings.notificationsEnabled : true)
                setEmailNotifications(settings.emailNotifications !== undefined ? settings.emailNotifications : true)
                setMarketingNotifications(settings.marketingNotifications || false)
                setAutoTranslate(settings.autoTranslate !== undefined ? settings.autoTranslate : true)
                setFontSize(settings.fontSize || "medium")
            }
        }
    }, [])

    // 다크 모드 설정 적용
    useEffect(() => {
        if (typeof window !== "undefined") {
            if (darkMode) {
                document.documentElement.classList.add("dark")
            } else {
                document.documentElement.classList.remove("dark")
            }
        }
    }, [darkMode])

    // 폰트 크기 설정 적용
    useEffect(() => {
        if (typeof window !== "undefined") {
            document.documentElement.dataset.fontSize = fontSize

            // 폰트 크기에 따른 스타일 적용
            const htmlElement = document.documentElement
            if (fontSize === "small") {
                htmlElement.style.fontSize = "14px"
            } else if (fontSize === "medium") {
                htmlElement.style.fontSize = "16px"
            } else if (fontSize === "large") {
                htmlElement.style.fontSize = "18px"
            }
        }
    }, [fontSize])

    // 설정 변경 시 로컬 스토리지에 저장
    const saveSettings = (settings) => {
        if (typeof window !== "undefined") {
            localStorage.setItem("userSettings", JSON.stringify(settings))
        }
    }

    const toggleDarkMode = () => {
        const newDarkMode = !darkMode
        setDarkMode(newDarkMode)
        saveSettings({
            darkMode: newDarkMode,
            language,
            notificationsEnabled,
            emailNotifications,
            marketingNotifications,
            autoTranslate,
            fontSize,
        })
    }

    const changeLanguage = (lang) => {
        setLanguage(lang)
        saveSettings({
            darkMode,
            language: lang,
            notificationsEnabled,
            emailNotifications,
            marketingNotifications,
            autoTranslate,
            fontSize,
        })
    }

    const toggleNotifications = () => {
        const newValue = !notificationsEnabled
        setNotificationsEnabled(newValue)
        saveSettings({
            darkMode,
            language,
            notificationsEnabled: newValue,
            emailNotifications,
            marketingNotifications,
            autoTranslate,
            fontSize,
        })
    }

    const toggleEmailNotifications = () => {
        const newValue = !emailNotifications
        setEmailNotifications(newValue)
        saveSettings({
            darkMode,
            language,
            notificationsEnabled,
            emailNotifications: newValue,
            marketingNotifications,
            autoTranslate,
            fontSize,
        })
    }

    const toggleMarketingNotifications = () => {
        const newValue = !marketingNotifications
        setMarketingNotifications(newValue)
        saveSettings({
            darkMode,
            language,
            notificationsEnabled,
            emailNotifications,
            marketingNotifications: newValue,
            autoTranslate,
            fontSize,
        })
    }

    const toggleAutoTranslate = () => {
        const newValue = !autoTranslate
        setAutoTranslate(newValue)
        saveSettings({
            darkMode,
            language,
            notificationsEnabled,
            emailNotifications,
            marketingNotifications,
            autoTranslate: newValue,
            fontSize,
        })
    }

    const changeFontSize = (size) => {
        setFontSize(size)
        saveSettings({
            darkMode,
            language,
            notificationsEnabled,
            emailNotifications,
            marketingNotifications,
            autoTranslate,
            fontSize: size,
        })
    }

    // 번역 함수
    const t = (key) => {
        return getTranslation(language, key)
    }

    return (
        <SettingsContext.Provider
            value={{
                darkMode,
                toggleDarkMode,
                language,
                setLanguage: changeLanguage,
                notificationsEnabled,
                toggleNotifications,
                emailNotifications,
                toggleEmailNotifications,
                marketingNotifications,
                toggleMarketingNotifications,
                autoTranslate,
                toggleAutoTranslate,
                fontSize,
                setFontSize: changeFontSize,
                t,
            }}
        >
            {children}
        </SettingsContext.Provider>
    )
}

export function useSettings() {
    const context = useContext(SettingsContext)
    if (context === undefined) {
        throw new Error("useSettings must be used within a SettingsProvider")
    }
    return context
}

