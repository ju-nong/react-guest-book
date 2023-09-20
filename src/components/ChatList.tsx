import { useEffect, useState, useRef } from "react";

import {
    Timestamp,
    getFirestore,
    query,
    collection,
    orderBy,
    limit,
    getDocs,
    startAfter,
    QuerySnapshot,
} from "firebase/firestore";
import { authService } from "../firebase";

type Chat = {
    id: string;
    createAt: Timestamp;
    email: string;
    name: string;
    profile: string;
    text: string;
};

function ChatList() {
    const db = getFirestore();

    const currentDocument = useRef<null | QuerySnapshot>(null);
    const [chats, setChats] = useState<Chat[]>([]);

    useEffect(() => {
        getChats(true);
    }, []);

    async function getChats(init = false) {
        let chatQuery = null;

        if (init) {
            chatQuery = query(
                collection(db, "chat"),
                orderBy("createAt", "desc"),
                limit(20),
            );
        } else {
            if (currentDocument.current)
                chatQuery = query(
                    collection(db, "chat"),
                    orderBy("createAt", "desc"),
                    startAfter(currentDocument.current.docs.at(-1)),
                    limit(20),
                );
        }

        const cacheDocument = currentDocument.current;

        currentDocument.current = await getDocs(chatQuery!);
        const { docs } = currentDocument.current;

        if (docs.length) {
            setChats((chats) => [
                ...docs.map(
                    (doc) => ({ id: doc.id, ...doc.data() } as unknown as Chat),
                ),
                ...chats,
            ]);
        } else {
            currentDocument.current = cacheDocument;
        }
    }

    function handleClick() {
        getChats();
    }

    return (
        <ul>
            <button onClick={handleClick}>이전꺼</button>
            {chats.map((chat) => (
                <li key={chat.id}>{chat.text}</li>
            ))}
        </ul>
    );
}

export { ChatList };
