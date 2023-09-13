import { useEffect, useRef, useState } from "react";
import Navbar from "./components/Navbar/Navbar";
import Documents from "./components/Documents/Documents";
import AuthModal from "./components/AuthModal/AuthModal";
import axios from "axios";

const App = () => {
  const authModalRef = useRef(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios({
        method: "GET",
        url: "/auth/user",
        withCredentials: true
    })
    .then((res) => typeof res.data === 'object' && res.data !== null ? setUser(res.data) : setUser(null))
    .catch((error) => console.log(error));
}, []);

  return (
    <>
      <Navbar user={user} authModalRef={authModalRef} />
      <Documents user={user} authModalRef={authModalRef} />
      <AuthModal authModalRef={authModalRef} />
    </>
  )
}

export default App;
