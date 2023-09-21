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

const ListStyled = styled.ul`
    width: 100%;
    display: flex;
    flex-direction: column;
    row-gap: 4px;
    list-style: none;
    overflow-anchor: none;
    overscroll-behavior: none;
    height: calc(100% - 20px);
    overflow-y: scroll;
    overflow-x: hidden;
    padding: 0px 16px 8px 16px;
    margin-bottom: 20px;
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
    const beforeScrollTop = useRef(-1);
    const cloneTriggerAddChart = useRef(false);

    useEffect(() => {
        if (triggerAddChat) {
            cloneTriggerAddChart.current = true;
        }
    }, [triggerAddChat]);

    useEffect(() => {
        if ($list.current) {
            const { scrollTop, scrollHeight } = $list.current;

            // 처음 들어오거나 사용자가 입력 했을 때
            if (beforeScrollTop.current < 0 || cloneTriggerAddChart.current) {
                $list.current.scrollTop = scrollHeight;
                cloneTriggerAddChart.current = false;
            } else if (beforeScrollTop.current === scrollTop) {
                $list.current.scrollTop = scrollHeight;
            } else {
                setNewChat(chats.at(-1) || null);
            }

            beforeScrollTop.current = $list.current.scrollTop;
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
            alert("마지막입니다");
        }
    }

    return (
        <ChatListContainerStyled>
            <button onClick={getBeforeChat}>이전꺼</button>
            <ListStyled ref={$list}>
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
