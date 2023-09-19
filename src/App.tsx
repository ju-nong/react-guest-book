import { useState, useEffect } from "react";

import { authService } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";

import { AccountModal } from "./components";

function App() {
    // Vercel 환경변수 추가
    const [isLogin, setIsLogin] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        onAuthStateChanged(authService, (user) => {
            console.log(user);

            setIsLogin(!!user);
            setIsLoaded(true);
        });
    }, []);

    return (
        <>
            {isLoaded ? (
                isLogin ? (
                    <p>어서오세요</p>
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
