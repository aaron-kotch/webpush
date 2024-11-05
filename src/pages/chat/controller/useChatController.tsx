import {
  createContext,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";

// Create the context
const ChatContext = createContext<ChatType>(null as any);

type ChatType = {
  messages: any[];
  setMessages: (messages: any) => SetStateAction<any[]>;
  handleSubmit: (e: any) => void;
};

type TMessage = {
  role: string;
  content: any[];
};

// Create a controller component
const ChatController = ({ children }: any) => {
  const [messages, setMessages] = useState<TMessage[]>([]);

  const { sendJsonMessage, readyState } = useWebSocket(
    "wss://d9uqi0h80i.execute-api.ap-southeast-1.amazonaws.com/staging",
    {
      onMessage: (event) => {
        handleIncomingMessage(event);
      },
      shouldReconnect: (closeEvent) => {
        console.log("closeEvent", closeEvent);
        return true;
      },
    }
  );

  const handleIncomingMessage = (event: any) => {
    console.log("event", event);

    const data = JSON.parse(event.data);

    setMessages((prev: any) => [...prev, data]);
  };

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  useEffect(() => {
    console.log("connectionStatus", connectionStatus);
  }, [readyState]);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log("query", messages);

    const filteredMessage = messages?.reduce((acc: any, curr: any) => {
      // if current role is assistant, and previous role is assistant, replace the previous message

      console.log("acc", acc);
      console.log("curr", curr);

      if (
        acc.length > 0 &&
        curr.role === "assistant" &&
        acc[acc.length - 1]?.role === "assistant"
      ) {
        return acc.slice(0, acc.length - 1).concat(curr);
      }

      return acc.concat(curr);
    }, [] as TMessage[]);

    sendJsonMessage({
      chatLogs: filteredMessage,
      message: e.target.query.value,
    });

    const newMessage = {
      role: "user",
      content: [
        {
          text: e.target.query.value,
        },
      ],
    };

    setMessages((prev) => [...prev, newMessage]);

    e.target.query.value = "";
  };

  const value = {
    messages,
    setMessages,
    handleSubmit,
  };

  return (
    <ChatContext.Provider value={value as any}>{children}</ChatContext.Provider>
  );
};

// Custom hook to use the counter context
const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useCounter must be used within a CounterController");
  }
  return context;
};

export { ChatController, useChat };
