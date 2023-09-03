import { faFile, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useState } from "react";
import { ChatContext } from "../ChatContext/ChatContext";
import { AuthContext } from "../../../Auth/AuthContext/AuthContext";
import {
  Timestamp,
  arrayUnion,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { v4 as uuid } from "uuid";
import { db, storage } from "../../../../config/firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const Input = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const { isAuth } = useContext(AuthContext);
  const { data } = useContext(ChatContext);
  let storageRef;
  const handleSend = async () => {
    if (img) {
      if (img.type.startsWith("application/")) {
        console.log(img);
        const fileType = "." + img.name.split(".").pop().toLowerCase();

        storageRef = ref(storage, uuid() + fileType);
        const uploadTask = uploadBytesResumable(storageRef, img);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
          },
          (error) => {
            alert("Error uploading file: " + error.message);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then(
              async (downloadURL) => {
                console.log(img.type);
                const messageType = img.type.startsWith("application/")
                  ? "application"
                  : "image";
                const messageData = {
                  id: uuid(),
                  text,
                  senderId: isAuth.uid,
                  date: Timestamp.now(),
                };
                if (messageType === "application") {
                  messageData.applicationURL = downloadURL;
                } else {
                  messageData.imageURL = downloadURL;
                }
                messageData.docs = "Docs";
                await updateDoc(doc(db, "chats", data.chatId), {
                  messages: arrayUnion(messageData),
                });
              }
            );
          }
        );
      } else {
        const storageRef = ref(storage, uuid());
        const uploadTask = uploadBytesResumable(storageRef, img);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            // switch (snapshot.state) {
            //   case "paused":
            //     console.log("Upload is paused");
            //     break;
            //   case "running":
            //     console.log("Upload is running");
            //     break;
            // }
          },
          (error) => {
            alert("first error" + error.message);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then(
              async (downloadURL) => {
                await updateDoc(doc(db, "chats", data.chatId), {
                  messages: arrayUnion({
                    id: uuid(),
                    text,
                    senderId: isAuth.uid,
                    date: Timestamp.now(),
                    img: downloadURL,
                  }),
                });
              }
            );
          }
        );
      }
    } else {
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: isAuth.uid,
          date: Timestamp.now(),
        }),
      });
    }

    await updateDoc(doc(db, "userChats", isAuth.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    // await updateDoc(doc(db, "userChats", data.user.uid), { // for storing message data of user itself
    //   [data.chatId + ".lastMessage"]: {
    //     text,
    //   },
    //   [data.chatId + ".date"]: serverTimestamp(),
    // });
    const ress = await getDoc(doc(db, "userChats", data.user.uid));
    console.log(ress);

    setText(null);
    setImg(null);
  };
  return (
    <>
      <div className="">
        <input
          type="file"
          placeholder="Message"
          id="file"
          style={{ display: "none" }}
          onChange={(e) => setImg(e.target.files[0])}
        />

        <label htmlFor="file" className="btn btn-light">
          {/* file */}
          <FontAwesomeIcon icon={faFile} />
        </label>
      </div>

      <input
        value={text == null ? "" : text}
        type="text"
        placeholder="Message"
        className="mx-2 form-control shadow-none width-control"
        onChange={(e) => setText(e.target.value)}
      />
      {(text === null || text[0] === " " || text === "") && !img ? null : (
        <button onClick={handleSend} className="btn btn-light rounded-3">
          <FontAwesomeIcon icon={faPaperPlane} />
        </button>
      )}
    </>
  );
};

export default Input;
