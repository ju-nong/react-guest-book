import { useState } from "react";

import { ChatList, ChatInput } from ".";
import styled from "@emotion/styled";

const ChatContainerStyled = styled.main`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    max-width: 740px;
`;

function ChatContainer() {
    const [actionAddChat, setActionAddChat] = useState(0);

    const addChatListener = () =>
        setActionAddChat((actionAddChat) => actionAddChat + 1);

    return (
        <ChatContainerStyled>
            <ChatList triggerAddChat={actionAddChat} />
            <ChatInput onTriggerAddChat={addChatListener} />
        </ChatContainerStyled>
    );
}

export { ChatContainer };
