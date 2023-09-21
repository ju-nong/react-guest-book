import styled from "@emotion/styled";

import dayjs from "dayjs";
import { authService } from "../firebase";

import { Chat } from "../types";
import { Timestamp } from "firebase/firestore";

const ChatItemStyled = styled.li`
    width: 100%;
    padding-left: 32px;
    display: flex;
    position: relative;
    column-gap: 6px;
    align-items: flex-end;

    &.first {
        margin-top: 16px;
        padding-top: 16px;
    }

    &.mine {
        padding-left: 0px;
        justify-content: flex-end;

        > div {
            display: none;
        }

        > p {
            order: 2;
        }

        > span {
            order: 1;
        }
    }

    > p {
        max-width: 565px;
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
        margin-bottom: 4px;
        white-space: nowrap;
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

const formatDate = (timestamp: Timestamp) =>
    dayjs(timestamp.toDate()).format("A h:mm");

function ChatItem({ chat, beforeChat, afterChat }: ChatItemProps) {
    const { email, text, name, profile, createAt } = chat;
    const formatCreateAt = formatDate(createAt);

    const showProfile = beforeChat === null || email !== beforeChat.email;
    const showDate =
        afterChat === null || formatCreateAt !== formatDate(afterChat.createAt);
    const isMine = email === authService.currentUser?.email;

    return (
        <ChatItemStyled
            className={`${showProfile ? "first" : ""} ${isMine ? "mine" : ""}`}
        >
            {showProfile ? (
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
            {showDate ? <span>{formatCreateAt}</span> : null}
        </ChatItemStyled>
    );
}

export { ChatItem };
