import {} from "react";
import styled from "@emotion/styled";

import { authService } from "../firebase";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { ChatInput } from ".";

function ChatContainer() {
    const db = getFirestore();

    return (
        <div>
            <ul></ul>
            <ChatInput />
        </div>
    );
}

export { ChatContainer };
