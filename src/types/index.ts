import { Timestamp } from "firebase/firestore";

type Chat = {
    id: string;
    createAt: Timestamp;
    email: string;
    name: string;
    profile: string;
    text: string;
};

export type { Chat };
