import React, {useState, useEffect} from "react";
import { Link } from "react-router-dom";
import {Settings} from "lucide-react"; // 뒤로가기
// import { Button } from "../../../../../components/ui/button.jsx"

import './followeeRefined.css';
import './followeeStyle.css';


const FolloweePage = () => {

    const [userName, setUserName] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [followee, setFollowee] = useState([]);
    const [followees, setFollowees] = useState([]);

    // userData
    // useEffect(() => {
    //     const userId = "user1001";
    //     fetch(`/api/posting/${userId}/userpage.do`, {
    //         credentials: "include"
    //     })
    //         .then((res) => res.json())
    //         .then((data) => {
    //             console.log("서버로부터 받아온 유저 데이터:", data);
    //             setUserName(data.user.userName);
    //             setUserEmail(data.user.userEmail);
    //         })
    //         .catch((err) => console.error("사용자 정보 불러오기 실패", err));
    // }, []);

    // followeeData
    useEffect(() => {
        const userId="user1001";
        fetch(`/api/posting/${userId}/followee.do`, {
            credentials: "include"
        })
            .then((res) => res.json())
            .then((data) => {
                setFollowee(data.findByFolloweeId.followers)
                setUserName(data.user.userName);
                setUserEmail(data.user.userEmail);
            })
            .catch((err) => console.error("불러오기 실패",err));
    }, []);


    return (
        <div id="followeepage-body">
            {/* Header */}
            <header>
                <ul>
                    <li><h1>art U</h1></li>
                    <li><img src="/placeholder.svg" alt="profile_image"/></li>
                    <li><span>{userName}</span></li>
                </ul>
            </header>

            {/* Aside */}
            <aside>
                <div id="nav-container">
                    <section>
                        <h2>{userName}님의 Followee</h2>
                    </section>
                </div>
            </aside>

           <div id="main-container">
                <div className="container mx-auto py-8 px-4">
                    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <h1 className="text-2xl font-bold mb-6 dark:text-white">Followee</h1>

                        {followees.length === 0 ? (
                            <p className="text-gray-500 dark:text-gray-400">팔로워한 사용자가 없습니다.</p>
                        ) : (
                            <ul className="space-y-4">
                                {followees.map((followee) => (
                                    <li key={followee.findByFolloweeId.followers.userId} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded">
                                        <div>
                                            <p className="font-semibold dark:text-white">{followee.findByFolloweeId.followers.userName}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{followee.findByFolloweeId.followers.userEmail}</p>
                                            {/*<p className="text-sm text-gray-500 dark:text-gray-400">{followee.findByFolloweeId.followers.userImgUrl}</p>*/}
                                        </div>
                                        {/*<Button*/}
                                        {/*    onClick={() => handleUnfollow(followee.userId)}*/}
                                        {/*    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md"*/}
                                        {/*>*/}
                                        {/*    언팔로우*/}
                                        {/*</Button>*/}
                                    </li>
                                ))}
                            </ul>
                        )}

                        <div className="mt-6">
                            <Link
                                to="/mypage"
                                className="inline-block px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
                            >
                                마이페이지로 돌아가기
                            </Link>
                        </div>
                    </div>
                </div>
           </div>
        </div>
    )
}

export default FolloweePage;