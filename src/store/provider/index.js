import React, { useReducer } from "react";

import { UserContext } from "../contexts";
import { UserReducer } from "../reducers";

const Provider = ({ children }) => {
  const [userState, userDispatch] = useReducer(UserReducer);

  return (
    <UserContext.Provider value={{ userState, userDispatch }}>
      {children}
    </UserContext.Provider>
  );
};

export default Provider;
