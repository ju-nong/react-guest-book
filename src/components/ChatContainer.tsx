import { User } from "firebase/auth";

type ChatContainerProps = {
    user: User | null;
};

function ChatContainer({ user }: ChatContainerProps) {
    console.log(user);

    return (
        <div>
            어서오세요
            <ul></ul>
        </div>
    );
}

export { ChatContainer };
