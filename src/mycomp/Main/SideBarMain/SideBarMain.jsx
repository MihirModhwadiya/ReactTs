import { useContext, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faHome,
  faPerson,
  faSignIn,
  faSignOut,
} from "@fortawesome/free-solid-svg-icons";
import { signOut } from "firebase/auth";
import { auth } from "../../../config/firebase";
import { AuthContext } from "../../Auth/AuthContext/AuthContext";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

SideBarMain.propTypes = {
  onToggle: PropTypes.func,
};

export default function SideBarMain({ onToggle }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleToggleClick = () => {
    setSidebarOpen(!sidebarOpen);
    onToggle();
  };

  const { isAuth } = useContext(AuthContext);

  return (
    <div id="hh" className="bg-primary bg-gradient">
      <div className="text-light" style={{ height: "700vh" }}>
        {isAuth ? (
          <div>
            <button
              className="navbar-toggler p-3"
              type="button"
              onClick={handleToggleClick}
            >
              <FontAwesomeIcon icon={faBars} />
            </button>
            <br />

            <Link to="/Body" className="btn text-light">
              <FontAwesomeIcon icon={faHome} />
            </Link>
            <br />
          </div>
        ) : null}

        {isAuth ? null : (
          <div>
            <a href="/Authcomp" className="btn text-light">
              <FontAwesomeIcon icon={faPerson} />
            </a>
            <br />

            <a href="/AuthLogIn" className="btn text-light">
              <FontAwesomeIcon icon={faSignIn} />
            </a>
            <br />
          </div>
        )}

        {isAuth ? (
          <button className="btn text-light" onClick={() => signOut(auth)}>
            <FontAwesomeIcon icon={faSignOut} />
          </button>
        ) : null}
        {isAuth ? (
          <button className="btn text-light position-fixed start-0 bottom-0 mb-3">
            <img src={isAuth.photoURL} width="30px" alt="" />
          </button>
        ) : null}
        <br />
      </div>
    </div>
  );
}