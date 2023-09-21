import { useEffect, useState, useRef } from "react";

import styled from "@emotion/styled";
import { ChatItem } from ".";

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

function ChatList() {
    const db = getFirestore();
    const beforeDocument = useRef<null | QueryDocumentSnapshot<DocumentData>>(
        null,
    );

    const [chats, setChats] = useState<Chat[]>([]);
    const $list = useRef<HTMLUListElement>(null);

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

        if ($list.current) {
            $list.current.scrollTop = $list.current.scrollHeight;
        }

        return () => {
            unsubscribe();
        };
    }, []);

    useEffect(() => {
        if ($list.current) {
            $list.current.scrollTop = $list.current.scrollHeight;
        }
    }, [chats]);

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
        </ChatListContainerStyled>
    );
}

export { ChatList };
