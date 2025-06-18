import { createContext, useState } from "react";

const GlobalContext = createContext();
const GlobalContextProvider = ({ children }) => {
  const [alert, setAlert] = useState({ type: null, message: null });
  const [redirect, setRedirect] = useState(null);
  return (
    <GlobalContext.Provider value={{ alert, setAlert, redirect, setRedirect }}>
      {children}
    </GlobalContext.Provider>
  );
};
export { GlobalContext, GlobalContextProvider };
