import { useRef } from "react";
import Navbar from "./components/Navbar/Navbar";
import Documents from "./components/Documents/Documents";
import AuthModal from "./components/AuthModal/AuthModal";

function App() {
  const authModalRef = useRef(null);

  return (
    <>
      <Navbar authModalRef={authModalRef} />
      <Documents />
      <AuthModal authModalRef={authModalRef} />
    </>
  )
}

export default App
