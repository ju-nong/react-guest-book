import {} from "react";
import styled from "@emotion/styled";

import { ChatList, ChatInput } from ".";

function ChatContainer() {
    return (
        <main>
            <ChatList />
            <ChatInput />
        </main>
    );
}

export { ChatContainer };
