import { useState, useEffect } from "react";

import { authService } from "./firebase";
import { onAuthStateChanged, User } from "firebase/auth";

import { AccountModal, ChatContainer } from "./components";

function App() {
    const [isLoaded, setIsLoaded] = useState(false);
    const [userState, setUserState] = useState<User | null>(null);

    useEffect(() => {
        onAuthStateChanged(authService, (user: User | null) => {
            console.log(user);

            setUserState(user);
            setIsLoaded(true);
        });
    }, []);

    return (
        <>
            {isLoaded ? (
                !!userState ? (
                    <ChatContainer user={userState} />
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
