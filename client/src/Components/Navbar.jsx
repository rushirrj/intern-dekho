import React, { useState, useEffect } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import fb from "../utils/firebase";

import { useNavigate } from "react-router-dom";

const Navbar = () => {
  let navigate = useNavigate();
  const [hamburger, setHamburger] = useState(false);
  const [user, setUser] = useState({});
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    console.log(user);
    if (user) {
      setUser(user);
      navigate("/internships");
    }
  }, []);
  const logOutUser = () => {
    localStorage.removeItem("user");
    setUser({});
  };
  const googleUserLogin = () => {
    const auth = getAuth(fb);
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then(async (result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        let _user = {
          email: result.user.email,
          uid: result.user.uid,
          name: result.user.displayName,
          token,
        };
        console.log(_user);
        setUser(_user);
        localStorage.setItem("user", JSON.stringify(_user));
        navigate("/internships");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.customData.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
      });
  };

  return (
    <div className="flex justify-between items-center p-4 shadow-lg">
      {/* Sidebar starts */}
      <div
        className=" flex flex-col justify-between w-3/6 sm:w-56"
        style={{
          minHeight: "100vh",
          background: "rgb(57 61 70 / 94%)",
          padding: 10,
          boxShadow: "6px 0px 2px rgba(0, 0, 0, 0.15)",
          zIndex: 2,
          position: "fixed",
          top: 0,
          left: !hamburger ? "-100%" : 0,
          bottom: 0,
          transition: "300ms ease-in",
        }}
      >
        <span
          onClick={() => setHamburger(false)}
          style={{
            position: "absolute",
            right: 10,
            top: 10,
            zIndex: 2,
            cursor: "pointer",
          }}
        >
          <CloseIcon style={{ color: "white" }} />
        </span>
        <div>
          <div className="flex flex-col gap-7 pr-8 justify-center items-center pt-11 ">
            <div onClick={() => navigate("/")} className="cursor-pointer text-lg hover:font-bold text-white">
              Home{" "}
            </div>
            <div>
              {!localStorage.getItem("user") ? (
                <button
                  onClick={googleUserLogin}
                  className="cursor-pointer text-lg hover:bg-orange-400 bg-navOrange rounded-md px-4 py-1 "
                >
                  Login
                </button>
              ) : (
                <button
                  onClick={logOutUser}
                  className="cursor-pointer text-lg hover:bg-orange-400 bg-navOrange rounded-md px-4 py-1 "
                >
                  {user?.name}
                </button>
              )}
            </div>

          </div>
        </div>
      </div>
      {/* Sidebar Ends */}
      <div className="flex flex-row sm:pl-8">
        <div>
          <img src="logo.jpg" alt="" className="h-8 sm:h-10" />
        </div>
      </div>
      <div className="hidden md:flex flex-row gap-7 pr-8 justify-center items-center ">
        <div onClick={() => navigate("/internships")} className="cursor-pointer text-lg hover:font-bold">Dashboard </div>

        {!localStorage.getItem("user") ? (
          <button
            onClick={googleUserLogin}
            className="cursor-pointer text-lg hover:bg-orange-400 bg-navOrange rounded-md px-4 py-1 "
          >
            Login
          </button>
        ) : (
          <button
            onClick={logOutUser}
            className="cursor-pointer text-lg hover:bg-orange-400 bg-navOrange rounded-md px-4 py-1 "
          >
            {user?.name}
          </button>
        )}
      </div>
      <div
        className="md:hidden cursor-pointer"
        onClick={() => {
          setHamburger(true);
          console.log("yes", hamburger);
        }}
      >
        <MenuIcon
          className="text-black"
          style={{ height: "32px", width: "32px" }}
        />
      </div>
    </div>
  );
};

export default Navbar;
