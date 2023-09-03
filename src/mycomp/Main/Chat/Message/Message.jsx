import { useContext } from "react";
import { AuthContext } from "../../../Auth/AuthContext/AuthContext";
import { ChatContext } from "../ChatContext/ChatContext";
import { pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile } from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

Message.propTypes = {
  message: PropTypes.object,
};

export default function Message({ message }) {
  const { isAuth } = useContext(AuthContext);
  const { curruser } = useContext(ChatContext);

  // const reff = useRef();
  // useEffect(() => {
  //   reff.current.scrollIntoView({ behavior: "smooth" });
  // }, [message]);

  // console.log(message);

  return (
    <>
      <div
        // ref={reff}
        className={`message ${
          message.senderId === isAuth.uid
            ? "d-flex justify-content-end py-3"
            : "d-flex justify-content-start py-3"
        }`}
      >
        {message.senderId === isAuth.uid ? null : (
          <img
            className="rounded-circle border border-1 border-dark"
            src={curruser.photoURL}
            width="30px"
            height={"30px"}
            alt=""
          />
        )}
        {message.text && (
          <p
            className="text-break border border-3 bg-primary bg-opacity-25 rounded-3 px-1"
            style={{
              maxWidth: "70%",
              wordWrap: "break-word",
            }}
          >
            {message.text && message.text}
          </p>
        )}

        {message.img && (
          <img
            src={message === undefined ? null : message.img}
            width="200px"
            alt=""
          />
        )}

        {message.imageURL && (
          <a
            href={message.imageURL}
            target="_blank"
            rel="noopener noreferrer"
            className="message-pdf"
          >
            <h3>{message.docs}</h3>
          </a>
        )}
        {message.applicationURL && (
          <a
            href={message.applicationURL}
            target="_blank"
            rel="noopener noreferrer"
            className="message-pdf border border-3 bg-dark bg-opacity-25 text-decoration-none"
          >
            <FontAwesomeIcon className="p-3 px-5" icon={faFile} />
          </a>
        )}
        {message.senderId === isAuth.uid ? (
          <div className="ms-3">
            <img
              className="rounded-circle border border-1 border-dark"
              src={isAuth.photoURL}
              width="30px"
              height={"30px"}
              alt=""
            />
          </div>
        ) : null}
        <br />
      </div>
    </>
  );
}
