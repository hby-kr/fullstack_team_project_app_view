import React, {useState, useEffect} from "react";
import { Link } from "react-router-dom";
import {Settings} from "lucide-react"; // 뒤로가기
// import { Button } from "../../../../../components/ui/button.jsx"

import './followerRefined.css';
import './followerStyle.css';


const FollowerPage = () => {

    const [userName, setUserName] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [follower, setFollower] = useState([]);
    const [followers, setFollowers] = useState([]);

    // followerData
    useEffect(() => {
        const userId="user1001";
        fetch(`/api/posting/${userId}/followee.do`, {
            credentials: "include"
        })
            .then((res) => res.json())
            .then((data) => {
                setFollower(data.findByFolloweeId.followees)
                setUserName(data.user.userName);
                setUserEmail(data.user.userEmail);
            })
            .catch((err) => console.error("불러오기 실패",err));
    }, []);


    return (
        <div id="followerpage-body">
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
                        <h2>{userName}님의 Follower</h2>
                    </section>
                </div>
            </aside>

            <div id="main-container">
                <div className="container mx-auto py-8 px-4">
                    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <h1 className="text-2xl font-bold mb-6 dark:text-white">Followee</h1>

                        {followers.length === 0 ? (
                            <p className="text-gray-500 dark:text-gray-400">팔로워한 사용자가 없습니다.</p>
                        ) : (
                            <ul className="space-y-4">
                                {followers.map((follower) => (
                                    <li key={follower.findByFolloweeId.followees.userId} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded">
                                        <div>
                                            <p className="font-semibold dark:text-white">{follower.findByFolloweeId.followees.userName}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{follower.findByFolloweeId.followees.userEmail}</p>
                                            {/*<p className="text-sm text-gray-500 dark:text-gray-400">{followee.findByFolloweeId.followers.userImgUrl}</p>*/}
                                        </div>
                                        {/*<Button*/}
                                        {/*    onClick={() => handleFollow(followee.userId)}*/}
                                        {/*    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md"*/}
                                        {/*>*/}
                                        {/*    팔로우*/}
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

export default FollowerPage;