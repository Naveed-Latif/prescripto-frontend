import { BrowserRouter } from "react-router-dom";
import AppLayout from "./Layout/AppLayout";
import { AppProvider } from "./context/AppContext";
import 'react-phone-input-2/lib/style.css'

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
