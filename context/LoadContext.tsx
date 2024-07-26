import {
  createContext,
  ReactNode,
  FC,
  useState,
  useContext,
  useMemo,
} from "react";
import { ACTIONS } from "../models";

interface LoadContextProps {
  action: ACTIONS;
  setAction: Function;
}

const LoadContext = createContext<LoadContextProps>({} as LoadContextProps);

interface LoadContextProviderProps {
  children: ReactNode;
}

const LoadContextProvider: FC<LoadContextProviderProps> = ({ children }) => {
  const [action, setAction] = useState<ACTIONS>(ACTIONS.LOADING);

  const memoizedValue = useMemo(
    () => ({ action, setAction }),
    [action, setAction]
  );

  return (
    <LoadContext.Provider value={memoizedValue}>
      {children}
    </LoadContext.Provider>
  );
};

const useLoadContext = () => useContext(LoadContext);

export { LoadContextProvider, useLoadContext };
