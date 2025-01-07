import { createRoot } from "react-dom/client";

import "./main.css";
import App from "./App.jsx";
import ContentProvider from "./context/content.jsx";
import AuthProvider from "./context/auth.jsx";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <ContentProvider>
      <div>
        <App />
      </div>
    </ContentProvider>
  </AuthProvider>
);
