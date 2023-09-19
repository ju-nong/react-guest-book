import { useState, useEffect } from "react";

import { authService } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";

import { AccountModal } from "./components";

function App() {
    const [isLogin, setIsLogin] = useState(false);

    useEffect(() => {
        onAuthStateChanged(authService, (user) => {
            setIsLogin(!!user);
        });
    }, []);

    return (
        <>
            Hello World!
            <AccountModal />
        </>
    );
}

export default App;
