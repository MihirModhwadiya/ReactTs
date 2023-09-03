import { useState } from "react";
import "./Body.css";
import Chat from "../Main/Chat/Chat";
import SideBar from "../Main/SideBar/SideBar";
import SideBarMain from "../Main/SideBarMain/SideBarMain";
import Header from "../Header/Header";
import { motion } from "framer-motion";
import Noti from "../noti/Noti";

export default function Body() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const [callSatus, setCallSatus] = useState(false);
  const funCallSatus = () => {
    setCallSatus(!callSatus);
  };

  const [userSelect, setUserSelect] = useState(false);
  const handleUserSelect = () => {
    setUserSelect(true);
  };

  const variants = {
    open: { opacity: 1, x: 0 },
    closed: { opacity: 1, x: "-100%" },
  };

  const transition = { damping: 0, duration: 0.1 };

  return (
    <>
      {/* {callSatus === false ? ( */}
        <nav
          className={`navbar d-flex position-fixed end-0 top-0 justify-content-end bg-dark bg-opacity-25 ${
            sidebarOpen ? "ch-body-open ch-body-open-nv" : "ch-body-close-nv"
          }`}
          style={{ zIndex: 10 }}
        >
          <Header handleCall={funCallSatus} />
        </nav>
          <div className="d-flex body">
            <SideBarMain onToggle={handleSidebarToggle} />
            <motion.div
              variants={variants}
              initial="closed"
              animate={sidebarOpen ? "open" : "closed"}
              transition={transition}
              className={`collapse sidebar bg-primary bg-gradient ${
                sidebarOpen ? "show" : ""
              }`}
              style={{ zIndex: 10 }}
              id="collapseExample"
            >
              <div style={{ zIndex: 9 }}>
                <SideBar h_u_Select={handleUserSelect} />
              </div>
            </motion.div>

            <main
              className={`main p-3 d-flex position-absolute end-0 justify-content-end ${
                sidebarOpen ? "ch-body-open" : "ch-body-close"
              }`}
            >
              <div className={`chat w-100`}>
                {userSelect === true ? (
                  <Chat sidebarOpen={sidebarOpen}/>
                  ) : null}
              </div>
                  <Noti/>
            </main>
          </div>
    </>
  );
}