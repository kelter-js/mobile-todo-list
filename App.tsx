import { FC } from "react";

import { LoadContextProvider } from "./context/LoadContext";
import Main from "./components/Main/Main";

const App: FC = () => (
  <LoadContextProvider>
    <Main />
  </LoadContextProvider>
);

export default App;
