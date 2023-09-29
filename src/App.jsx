import axios from "axios";
import Home from "./routes/Home/Home";
import Layout from "./components/Layout/Layout";
import Document from "./routes/Document/Document";
import { useEffect, useRef, useState } from "react";
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
        <Route path='/' element={<Layout user={user} authModalRef={authModalRef}><Home user={user} authModalRef={authModalRef}/></Layout>} />
        <Route path='/documents/:documentId' element={<Layout user={user} authModalRef={authModalRef}><Document user={user}/></Layout>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
