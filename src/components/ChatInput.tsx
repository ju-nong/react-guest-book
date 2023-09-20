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
        if (event.nativeEvent.isComposing) {
            return;
        }

        const { value: text } = event.target as HTMLInputElement;

        if (event.key === "Enter" && text) {
            const { currentUser } = authService;
            (event.target as HTMLInputElement).value = "";

            if (currentUser) {
                try {
                    const createAt = new Date();
                    const {
                        displayName: name,
                        email,
                        photoURL: profile,
                    } = currentUser;

                    await addDoc(collection(db, "chat"), {
                        createAt,
                        email,
                        name,
                        profile,
                        text,
                    });
                } catch (error) {
                    console.log(error);
                }
            }
        }
    }

    return <InputStyled type="text" onKeyDown={handleKeyDown} />;
}

export { ChatInput };
