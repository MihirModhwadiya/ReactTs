import { createContext, useContext, useReducer, useState } from "react";
import { AuthContext } from "../../../Auth/AuthContext/AuthContext";
import PropTypes from "prop-types";

export const ChatContext = createContext();

ChatContextProvider.propTypes = {
  children: PropTypes.node,
};

export function ChatContextProvider({ children }) {
  const { isAuth } = useContext(AuthContext);
  const INITIAL_STATE = {
    chatId: "null",
    user: {},
  };

  const [curruser, setCurruser] = useState({});
  const chatReducer = (state, action) => {
    setCurruser(action.payload);
    switch (action.type) {
      case "CHANGE_USER":
        return {
          user: action.payload,
          chatId:
            isAuth.uid > action.payload.uid
              ? isAuth.uid + action.payload.uid
              : action.payload.uid + isAuth.uid,
        };

      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);

  return (
    <ChatContext.Provider value={{ data: state, dispatch, curruser }}>
      {children}
    </ChatContext.Provider>
  );
}
