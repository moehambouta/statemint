import axios from "axios";
import Home from "./routes/Home/Home";
import { useEffect, useRef, useState } from "react";
import Document from "./routes/Document/Document";
import { BrowserRouter, Routes, Route } from "react-router-dom";

/**
 * TODO: Add footer
 * TODO: Implement better way for authenticating user
 * TODO: Implement "Layout" component to add route elements to
**/
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
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home user={user} authModalRef={authModalRef}/>} />
        <Route path='/documents/:documentId' element={<Document user={user} authModalRef={authModalRef}/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
