import { useState, useEffect } from "react";

import styled from "@emotion/styled";

import { FaChevronDown } from "react-icons/fa";
import { Chat } from "../types";

const ChatNewNoticeContainerStyled = styled.div`
    cursor: pointer;
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 10;
    width: 100%;
    display: flex;
    align-items: center;
    height: 38px;
    background-color: rgba(222, 225, 229, 0.9);
    padding: 0 16px;
    backdrop-filter: blur(4px);

    &.hide {
        display: none;
    }

    > p {
        padding-left: 4px;
        flex: 1;
        color: rgb(30, 30, 35);
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-size: 14px;
    }

    > button {
        background: none;
        color: #636369;
    }
`;

const ProfileStyled = styled.div`
    display: flex;
    column-gap: 4px;
    align-items: center;

    > img {
        width: 24px;
        height: 24px;
        object-fit: cover;
        border-radius: 100%;
    }

    > span {
        font-weight: 700;
        font-size: 11px;
        white-space: pre;
    }
`;

type ChatNewNoticeProps = {
    chat: Chat | null;
    onMoveRecent: () => void;
};

function ChatNewNotice({ chat, onMoveRecent }: ChatNewNoticeProps) {
    const [isShow, setIsShow] = useState(false);

    useEffect(() => {
        setIsShow(!!chat);
    }, [chat]);

    // 숨기고 맨 하단으로 이동
    function handleMoveRecent() {
        setIsShow(false);
        onMoveRecent();
    }

    return (
        <ChatNewNoticeContainerStyled
            className={isShow ? "" : "hide"}
            onClick={handleMoveRecent}
        >
            <ProfileStyled>
                <img
                    src={chat?.profile || "/images/guest-profile.png"}
                    alt={`${chat?.name || "Guest"} Profile`}
                />
                <span>{chat?.name || "Guest"}</span>
            </ProfileStyled>
            <p>{chat?.text}</p>
            <button>
                <FaChevronDown />
            </button>
        </ChatNewNoticeContainerStyled>
    );
}

export { ChatNewNotice };
