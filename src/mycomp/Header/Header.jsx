import { useContext, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone, faVideoCamera } from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../Auth/AuthContext/AuthContext";
import { ChatContext } from "../Main/Chat/ChatContext/ChatContext";
import PropTypes from "prop-types";

Header.propTypes = {
  handleCall: PropTypes.func,
};

export default function Header({ handleCall }) {
  const { isAuth } = useContext(AuthContext);
  const [callStatus, setCallStatus] = useState(false);
  const { curruser } = useContext(ChatContext);

  const funnCallStatus = () => {
    setCallStatus(!callStatus);
    handleCall();
  };
  return (
    <nav className=" nav p-1">
      <div className="btn-group" type="button">
        <button onClick={funnCallStatus} className="btn btn-light px-2">
          <FontAwesomeIcon icon={faPhone} />
        </button>
        <button onClick={funnCallStatus} className="btn btn-light px-2">
          <FontAwesomeIcon icon={faVideoCamera} />
        </button>
      </div>
      {isAuth ? (
        <div className="border-1 d-flex ps-2">
          <div className="bg-light d-flex align-items-center">
            <img
              src={curruser.photoURL}
              height="40px"
              width="60px"
              className=""
              alt=""
            />
          </div>
        </div>
      ) : null}
      <br />
    </nav>
  );
}
