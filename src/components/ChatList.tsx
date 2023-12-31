import { useEffect, useState, useRef } from "react";

import styled from "@emotion/styled";
import { ChatItem, ChatNewNotice } from ".";

import {
    getFirestore,
    query,
    collection,
    orderBy,
    limit,
    getDocs,
    startAfter,
    onSnapshot,
    QueryDocumentSnapshot,
    DocumentData,
} from "firebase/firestore";

import { Chat } from "../types";

const ChatListContainerStyled = styled.div`
    position: relative;
    overflow: hidden;
    flex: 1;
    width: 100%;
    min-width: 320px;
`;

const LoaderStyled = styled.li`
    width: 15px;
    height: 15px;
    border-radius: 50%;
    padding: 15px;
    margin-top: 16px;
    position: relative;
    animation: rotate 1s linear infinite;
    display: inline-block;
    align-self: center;

    &::before {
        content: "";
        box-sizing: border-box;
        position: absolute;
        inset: 0px;
        border-radius: 50%;
        border: 3px solid rgb(222, 225, 229);
        animation: prixClipFix 2s linear infinite;
    }
`;

const ListStyled = styled.ul`
    width: 100%;
    display: flex;
    flex-direction: column;
    row-gap: 4px;
    list-style: none;
    overflow-anchor: none;
    overscroll-behavior: none;
    height: 100%;
    overflow-y: scroll;
    overflow-x: hidden;
    padding: 0px 8px 8px 16px;

    &::-webkit-scrollbar {
        width: 8px;
    }

    &::-webkit-scrollbar-thumb {
        background-color: rgb(204, 204, 204);
        border-radius: 10px;
    }

    &::-webkit-scrollbar-track {
        background-color: transparent;
    }
`;

type QueryType = "basic" | "before";
const LIMIT = 50;

type ChatListProps = {
    triggerAddChat: number;
};

function ChatList({ triggerAddChat }: ChatListProps) {
    const db = getFirestore();
    const beforeDocument = useRef<null | QueryDocumentSnapshot<DocumentData>>(
        null,
    );

    const [chats, setChats] = useState<Chat[]>([]);
    const [newChat, setNewChat] = useState<Chat | null>(null);
    function getQuery(type: QueryType) {
        switch (type) {
            case "basic":
                return query(
                    collection(db, "chat"),
                    orderBy("createAt", "desc"),
                    limit(LIMIT),
                );
            case "before":
                return query(
                    collection(db, "chat"),
                    orderBy("createAt", "desc"),
                    startAfter(beforeDocument.current),
                    limit(LIMIT),
                );
        }
    }

    useEffect(() => {
        const unsubscribe = onSnapshot(getQuery("basic"), (snapshot) => {
            const changes = snapshot.docChanges();
            const reversedChanges = changes.reverse();

            // init
            if (!beforeDocument.current) {
                setChats((chats) => [
                    ...chats,
                    ...reversedChanges.map(
                        (change) =>
                            ({
                                id: change.doc.id,
                                ...change.doc.data(),
                            } as Chat),
                    ),
                ]);

                beforeDocument.current = reversedChanges[0].doc;
            } else {
                // 추가된 것이 있으면
                const newChats: DocumentData[] = [];

                for (let i = 0; i < reversedChanges.length; i++) {
                    const { type, doc } = reversedChanges[i];

                    if (type === "added") {
                        newChats.push(doc);
                    }
                }

                setChats((chats) => [
                    ...chats,
                    ...newChats.map(
                        (chat) =>
                            ({
                                id: chat.id,
                                ...chat.data(),
                            } as Chat),
                    ),
                ]);
            }
        });

        return () => {
            unsubscribe();
        };
    }, []);

    const $list = useRef<HTMLUListElement>(null);
    const init = useRef(true);
    const isScrolledToBottom = useRef(false); // 맨 하단인지
    const cloneTriggerAddChat = useRef(false); // 채팅 추가 Trigger
    const [newBeforeChat, setNewBeforeChat] = useState(false); // 이전 채팅 추가 Trigger
    const prevScrollHeight = useRef(0); // 이전 scrollHeight
    const isEnd = useRef(false); // 마지막 대화인지

    useEffect(() => {
        if (triggerAddChat) {
            cloneTriggerAddChat.current = true;
        }
    }, [triggerAddChat]);

    useEffect(() => {
        if ($list.current && chats.length) {
            const { scrollHeight } = $list.current;

            // init이거나 입력 했을 때
            if (init.current || cloneTriggerAddChat.current) {
                $list.current.scrollTop = scrollHeight;

                init.current = false;
                cloneTriggerAddChat.current = false;

                setNewChat(null);
            } else if (isScrolledToBottom.current) {
                // 맨 하단일 때
                $list.current.scrollTop = scrollHeight;
            } else if (newBeforeChat) {
                // 이전 채팅 추가 됐을 때
                setNewBeforeChat(false);

                $list.current.scrollTop =
                    scrollHeight - prevScrollHeight.current;
            } else {
                // 중간일 때
                setNewChat(chats.at(-1) || null);
            }
        }
    }, [chats]);

    // 맨 하단으로 이동
    function handleMoveRecent() {
        if ($list.current) {
            $list.current.scrollTop = $list.current.scrollHeight;
        }
    }

    // 이전 채팅 기록 가져오기
    async function getBeforeChat() {
        const chatQuery = getQuery("before");
        const { docs } = await getDocs(chatQuery!);

        if (docs.length) {
            const reversedBeforeChats = docs.reverse();

            setChats((chats) => [
                ...reversedBeforeChats.map(
                    (doc) => ({ id: doc.id, ...doc.data() } as Chat),
                ),
                ...chats,
            ]);

            beforeDocument.current = reversedBeforeChats[0];
        } else {
            isEnd.current = true;
            setNewBeforeChat(false);

            alert("마지막입니다");
        }
    }

    function handleScroll() {
        const { scrollTop, clientHeight, scrollHeight } = $list.current!;

        isScrolledToBottom.current =
            scrollHeight - clientHeight - 50 <= scrollTop;

        // 맨 하단일 때
        if (isScrolledToBottom.current) {
            setNewChat(null);
        }

        if (!scrollTop && !init.current && !isEnd.current) {
            setNewBeforeChat(true);
            prevScrollHeight.current = scrollHeight;
            getBeforeChat();
        }
    }

    return (
        <ChatListContainerStyled>
            <ListStyled ref={$list} onScroll={handleScroll}>
                {newBeforeChat ? <LoaderStyled /> : null}
                {chats.map((chat, index) => (
                    <ChatItem
                        key={chat.id}
                        chat={chat}
                        beforeChat={chats[index - 1] || null}
                        afterChat={chats[index + 1] || null}
                    />
                ))}
            </ListStyled>
            <ChatNewNotice chat={newChat} onMoveRecent={handleMoveRecent} />
        </ChatListContainerStyled>
    );
}

export { ChatList };
