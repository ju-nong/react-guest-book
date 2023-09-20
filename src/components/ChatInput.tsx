import { KeyboardEvent } from "react";
import styled from "@emotion/styled";

import { authService } from "../firebase";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const InputStyled = styled.input`
    border: 1px solid #000;
`;

function ChatInput() {
    const db = getFirestore();

    async function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
        if (event.key === "Enter") {
            const { currentUser } = authService;

            if (currentUser) {
                try {
                    const createAt = new Date();
                    const {
                        displayName: name,
                        email,
                        photoURL: profile,
                    } = currentUser;
                    const { value: text } = event.target as HTMLInputElement;

                    const docRef = await addDoc(collection(db, "chat"), {
                        createAt,
                        email,
                        name,
                        profile,
                        text,
                    });

                    console.log("Document written with ID: ", docRef.id);
                } catch (error) {
                    console.log(error);
                }
            }

            (event.target as HTMLInputElement).value = "";
        }
    }

    return <InputStyled type="text" onKeyDown={handleKeyDown} />;
}

export { ChatInput };
