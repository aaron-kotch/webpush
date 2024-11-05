import { ThemeProvider } from "@/providers/theme-provider";
import { ChatPage } from "@/pages/chat/ChatPage";

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <ChatPage />
    </ThemeProvider>
  );
}

export default App;
