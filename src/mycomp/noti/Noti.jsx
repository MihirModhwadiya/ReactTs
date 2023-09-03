import { useContext, useEffect, useState } from "react";
import { ChatContext } from "../Main/Chat/ChatContext/ChatContext";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "../../config/firebase";

function showNoti(title, options) {
  if (Notification.permission === "granted") {
    new Notification(title, options);
  }
}
const Noti = () => {
  const { data } = useContext(ChatContext);
  const { curruser } = useContext(ChatContext);
  const [lastmsg, setLastmsg] = useState(null);
  const chatId = data.chatId;

  useEffect(() => {
    const getd = async () => {
      try {
        const chatDoc = await getDoc(doc(db, "userChats", curruser.uid));
        if (chatDoc.exists()) {
          const lastMessage = chatDoc.data();
          setLastmsg(lastMessage[chatId]["lastMessage"]?.text || "");
        } else {
          console.log("Chat document doesn't exist.");
        }
      } catch (error) {
        console.error("Error fetching last message:", error);
      }
    };
    let flag;

    if (curruser.uid !== undefined) {
      flag = 0;
      const unsubscribe = onSnapshot(doc(db, "userChats", curruser.uid), () => {
        getd();
        if (
          lastmsg != null &&
          flag === 0 &&
          Notification.permission === "granted"
        ) {
          showNoti("New Message", {
            body: lastmsg,
            icon: curruser.photoURL,
          });
        } else {
          Notification.requestPermission().then((permission) => {
            if (lastmsg != null && flag === 0 && permission === "granted") {
              showNoti("New Message", {
                body: lastmsg,
                icon: curruser.photoURL,
              });
            }
          });
        }
        flag++;
      });

      return () => {
        unsubscribe();
      };
    }
  }, [lastmsg]);

  return <div></div>;
};

export default Noti;
