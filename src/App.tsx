import { useState, useEffect } from "react";

import { authService } from "./firebase";
import { onAuthStateChanged, User } from "firebase/auth";

import { AccountModal, ChatContainer } from "./components";

function App() {
    // Vercel 환경변수 추가
    const [isLogin, setIsLogin] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        onAuthStateChanged(authService, (user: User | null) => {
            // console.log(user);

            setIsLogin(!!user);
            setIsLoaded(true);
        });
    }, []);

    return (
        <>
            {isLoaded ? (
                isLogin ? (
                    <ChatContainer />
                ) : (
                    <AccountModal />
                )
            ) : (
                <p>로딩 중</p>
            )}
        </>
    );
}

export default App;
