import { ChatList, ChatInput } from ".";
import styled from "@emotion/styled";

const ChatContainerStyled = styled.main`
    padding: 0px 16px;
`;

function ChatContainer() {
    return (
        <ChatContainerStyled>
            <ChatList />
            <ChatInput />
        </ChatContainerStyled>
    );
}

export { ChatContainer };
