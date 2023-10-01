import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Document from "./components/Document/Document";
import Dashboard from "./components/Dashboard/Dashboard";
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
        <Route path='/' element={<Dashboard user={user} authModalRef={authModalRef} />} />
        <Route path='/document/:documentId' element={<Document user={user}/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
