import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

import firebase from "./firebase";

console.log(firebase);

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
