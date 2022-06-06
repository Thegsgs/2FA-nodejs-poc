import { Route, Routes, useNavigate } from "react-router-dom";
import LoginForm from "./LoginForm";
import Api from "../utils/Api.js";
import Verify from "./Verify";
import { useEffect, useState } from "react";
import Success from "./Success";

function App() {
  const navigate = useNavigate();
  const [qrcode, setQrcode] = useState("");
  const [currentUser, setCurrentUser] = useState("");

  useEffect(() => {
    setQrcode("");
  }, [currentUser]);

  function onLogin(userObject) {
    Api.login(userObject).then((data) => {
      setQrcode(data.data);
      setCurrentUser(userObject.username);
      navigate("/verify");
    });
  }

  function onVerify(token) {
    Api.verify(token).then((data) => {
      console.log(data);
      if (data.verified === true) {
        navigate("/success");
      }
    });
  }

  return (
    <div className='app'>
      <Routes>
        <Route path='/' element={<LoginForm onLogin={onLogin} />} />
        <Route
          path='/verify'
          element={<Verify qrcode={qrcode} onVerify={onVerify} />}
        />
        <Route path='/success' element={<Success />} />
      </Routes>
    </div>
  );
}

export default App;
