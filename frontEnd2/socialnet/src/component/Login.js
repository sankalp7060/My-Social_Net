import React, { useCallback, useState } from "react";
import axios from "axios";
import { USER_API_END_POINT } from "../utils/constant";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getUser } from "../redux/userSlice";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (isLogin) {
      try {
        const res = await axios.post(`${USER_API_END_POINT}/login`, { email, password }, {
          headers: {
            'Content-Type': "application/json"
          },
          withCredentials: true
        }); 
        if(res.data.success){
          dispatch(getUser(res?.data?.user));
          navigate("/");
          toast.success(res.data.message);
        }
      } catch (error) {
        toast.success(error.response.data.message);
        console.log(error);
      }
    } else {
      try {
        const res = await axios.post(`${USER_API_END_POINT}/register`, { name, username, email, password }, {
          headers: {
            'Content-Type': "application/json"
          },
          withCredentials: true
        }); 
        if(res.data.success){
          setIsLogin(true);
          toast.success(res.data.message);
        }
      } catch (error) {
        toast.success(error.response.data.message);
        console.log(error);
      }
    }
    setLoading(false);
  }

  const loginhandler = useCallback(() => {
    setIsLogin((prev) => !prev);
  },[]);  

  return (
    <div className="w-screen h-screen flex items-center justify-center ml-[-50px]">
      <div className="flex items-center justify-evenly w-[80%]">
        <div>
          <img width="1400px" src="/mainlogo2.png" alt="Main logo" />
        </div>
        <div className="ml-[-40px] w-full">
          <div className="mx-4 my-5">
            <h1 className="font-bold text-5xl text-[#0A5F70]">
              Your World, Your Network
            </h1>
          </div>
          <h1 className="mx-4 mt-6 mb-3 text-2xl font-bold text-[#0A5F70]">
            {isLogin ? "Sign In" : "Sign Up"}
          </h1>
          <form onSubmit={submitHandler} className="mx-3 flex flex-col w-[80%]">
            {!isLogin && (
              <>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  placeholder="Name"
                  className="outline-[#048193] border-2 border-[#1C8D9F] px-3 py-2 rounded-full my-1 font-semibold"
                />
                <input
                  value={username}
                  onChange={(e) => setUserName(e.target.value)}
                  type="text"
                  placeholder="Username"
                  className="outline-[#048193] border-2 border-[#1C8D9F] px-3 py-2 rounded-full my-1 font-semibold"
                />
              </>
            )}
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Email"
              className="outline-[#048193] border-2 border-[#1C8D9F] px-3 py-2 rounded-full my-1 font-semibold"
            />
            <div className="relative">
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="outline-[#048193] border-2 border-[#1C8D9F] px-3 py-2 rounded-full my-1 font-semibold w-full pr-10"
              />
              <span
                className="absolute right-3 top-4 cursor-pointer text-[#0A5F70]"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <FaRegEyeSlash size={22} />
                ) : (
                  <FaRegEye size={22} />
                )}
              </span>
            </div>

            <button className="bg-[#0A5F70] my-4 py-2 border-none rounded-full text-lg text-white font-semibold" disabled={loading}>
            {loading ? "Processing..." : isLogin ? "Sign In" : "Create Account"}
            </button>
            <h1 className="ml-1">
              {isLogin
                ? "Do not have an account? "
                : "Already have an account? "}
              <span
                onClick={loginhandler}
                className="font-bold text-[#0A5F70] cursor-pointer"
              >
                {isLogin ? "Sign Up" : "Sign In"}
              </span>
            </h1>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
