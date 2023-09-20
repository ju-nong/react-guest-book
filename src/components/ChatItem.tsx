import React from "react";
import styled from "@emotion/styled";

import dayjs from "dayjs";

import { Chat } from "../types";

const ChatItemStyled = styled.li`
    width: 100%;
    padding-left: 32px;
    display: flex;
    position: relative;
    column-gap: 6px;

    &.first {
        margin-top: 16px;
        padding-top: 16px;
    }

    > p {
        padding: 9px 12px;
        font-size: 13px;
        line-height: 16px;
        border-radius: 21px;
        background-color: rgb(243, 244, 248);
        word-break: break-word;
        word-wrap: break-word;
        white-space: pre-wrap;
        color: rgb(30, 30, 35);
    }

    > span {
        line-height: 12px;
        font-size: 10px;
        color: rgb(118, 118, 120);
    }
`;

const ProfileStyled = styled.div`
    display: flex;
    position: absolute;
    top: 0;
    left: 0;
    column-gap: 8px;

    > button {
        width: 24px;
        height: 24px;
        border-radius: 100%;
        cursor: pointer;
        overflow: hidden;

        > img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    }

    > span {
        font-size: 11px;
        line-height: 13px;
        color: rgb(30, 30, 35);
    }
`;

type ChatItemProps = {
    chat: Chat;
    beforeChat: Chat | null;
    afterChat: Chat | null;
};

function ChatItem({ chat, beforeChat, afterChat }: ChatItemProps) {
    let isFirst = beforeChat === null;
    const { email, text, name, profile } = chat;

    if (beforeChat) {
        isFirst = email !== beforeChat.email;
    }

    return (
        <ChatItemStyled className={isFirst ? "first" : ""}>
            {isFirst ? (
                <ProfileStyled>
                    <button>
                        <img
                            src={profile || "/images/guest-profile.png"}
                            alt={`${name || "Guest"} Profile`}
                        />
                    </button>
                    <span>{name || "Guest"}</span>
                </ProfileStyled>
            ) : null}
            <p>{text}</p>
        </ChatItemStyled>
    );
}

export { ChatItem };
