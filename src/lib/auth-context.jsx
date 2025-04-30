import React from "react"

import {createContext, useContext, useState} from "react"

const AuthContext = createContext(undefined);
// 초기값을 undefined로 설정함. 이는 이후 useAuth 훅에서 AuthProvider 없이 사용할 경우 오류를 발생시키기 위함임.

//AuthProvider는 AuthContext.Provider를 감싸서 자식 컴포넌트에 인증 상태를 전달해주는 역할을 함.
export function AuthProvider({children}) {

   const [loginUser, setLoginUser] = useState(null)
   const user = [loginUser, setLoginUser]

   // AuthContext.Provider를 사용해서 user, signIn, logout, loading 값을 자식 컴포넌트에 전달함.
   return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>
}

// 단순히 useContext(AuthContext)라는 인증 상태를 가져오는 커스텀 useAuth 훅
export function useAuth() {
   const context = useContext(AuthContext)
   if (context === undefined) {
      throw new Error("useAuth must be used within an AuthProvider")
   }
   return context // 즉 [loginUser, setLoginUser]
}


