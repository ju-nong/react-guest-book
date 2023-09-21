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
    return (
        <ChatContainerStyled>
            <ChatList />
            <ChatInput />
        </ChatContainerStyled>
    );
}

export { ChatContainer };
