import { useContext, useEffect, useRef, useState } from "react";
import { ChatContext } from "../ChatContext/ChatContext";
import { doc, onSnapshot } from "firebase/firestore";
import Message from "./Message";
import { db } from "../../../../config/firebase";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const { data } = useContext(ChatContext);
  const messagesEndRef = useRef(null); // Reference to the last message element

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
      if (doc.exists()) {
        setMessages(doc.data().messages);
      }
    });

    return () => {
      unSub();
    };
  }, [data.chatId]);

  useEffect(() => {
    // scroll to the last message when the component loads or when messages update
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView();
    }
  }, [messages]);

  return (
    <div>
      {messages && messages.map((m, index) => (
        <div key={m.id}>
          <Message message={m} />
          {index === messages.length - 1 && (
            <div ref={messagesEndRef} />
          )}
        </div>
      ))}
    </div>
  );
};

export default Messages;
