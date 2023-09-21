import { KeyboardEvent, useRef, useState } from "react";
import styled from "@emotion/styled";

import { useOutside } from "../utils";

import { authService } from "../firebase";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const ChatInputContainerStyled = styled.div`
    display: flex;
    border-top: 0.5px solid rgba(0, 0, 0, 0.1);
    padding: 16px 0px 16px 8px;
`;

const ProfileContainer = styled.div`
    margin-top: -4px;
    > div {
        width: 24px;
        height: 24px;
        border-radius: 100%;
        overflow: hidden;

        > img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    }
`;

const InputContainer = styled.div`
    padding-left: 8px;
    flex: 1;
`;

const InputStyled = styled.textarea`
    border: none;
    outline: none;
    width: 100%;
    resize: none;
`;

const SendButtonStyled = styled.button`
    width: 74px;
    height: 30px;
    margin: 0px 8px;
    border-radius: 6px;
    background-color: #1a88e9;
    color: #fff;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;

    &:disabled {
        background-color: rgb(243, 244, 248);
        color: rgba(0, 0, 0, 0.1);
        cursor: auto;
    }
`;

type ChatInputProps = {
    onTriggerAddChat: () => void;
};

function ChatInput({ onTriggerAddChat }: ChatInputProps) {
    const db = getFirestore();
    const { currentUser } = authService;
    const { displayName: name, email, photoURL: profile } = currentUser!;

    const [isFocus, setIsFocus] = useState(false);
    const $textarea = useRef<HTMLTextAreaElement>(null);
    useOutside($textarea, () => setIsFocus(false));

    const [text, setText] = useState("");

    function handleInput(event: KeyboardEvent<HTMLTextAreaElement>) {
        const { value } = event.target as HTMLTextAreaElement;

        setText(value.trim());
    }

    async function addChat() {
        onTriggerAddChat();

        setTimeout(() => {
            if ($textarea.current) {
                $textarea.current.value = "";
            }
        }, 0);

        try {
            const createAt = new Date();

            await addDoc(collection(db, "chat"), {
                createAt,
                email,
                name,
                profile,
                text,
            });
        } catch (error) {
            console.log(error);
        } finally {
            setText("");
        }
    }

    function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
        const { nativeEvent, key, shiftKey } = event;

        // 조합문자
        if (nativeEvent.isComposing) {
            return;
        }

        // 줄바꿈
        if (key === "Enter" && shiftKey) {
            return;
        }

        if (event.key === "Enter" && text) {
            addChat();
        }
    }

    return (
        <ChatInputContainerStyled>
            {isFocus ? null : (
                <ProfileContainer>
                    <div>
                        <img
                            src={profile || "/images/guest-profile.png"}
                            alt={`${name || "Guest"} Profile`}
                        />
                    </div>
                </ProfileContainer>
            )}

            <InputContainer>
                <InputStyled
                    placeholder={`${name || "Guest"}(으)로 메시지 작성`}
                    ref={$textarea}
                    onFocus={() => setIsFocus(true)}
                    onInput={handleInput}
                    onKeyDown={handleKeyDown}
                />
            </InputContainer>
            <SendButtonStyled disabled={!text.length} onClick={addChat}>
                보내기
            </SendButtonStyled>
        </ChatInputContainerStyled>
    );
}

export { ChatInput };
