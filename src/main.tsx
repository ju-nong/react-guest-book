import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

import firebase from "./firebase";

import dayjs from "dayjs";
dayjs.locale("ko");

console.log(firebase);

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
