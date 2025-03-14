import { FC } from "react";

import { LoadContextProvider } from "./context/LoadContext";
import { StateContextProvider } from "./context/StateContext";
import Main from "./components/Main/Main";

const App: FC = () => (
  <LoadContextProvider>
    <StateContextProvider>
      <Main />
    </StateContextProvider>
  </LoadContextProvider>
);

export default App;
