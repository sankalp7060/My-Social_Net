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
  const [username, setUsername] = useState("");
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const submitHandler = async (e) => {
    e.preventDefault();
    if (isLogin && (!emailOrUsername || !password)) {
      toast.error("Email/Username and password are required");
      return;
    }
    if (!isLogin && (!name || !username || !emailOrUsername || !password)) {
      toast.error("All fields are required");
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        const res = await axios.post(
          `${USER_API_END_POINT}/login`,
          { emailOrUsername, password },
          {
            headers: {
              'Content-Type': "application/json"
            },
            withCredentials: true
          }
        );
        
        if (res.data.success) {
          dispatch(getUser(res.data.user));
          navigate("/");
          toast.success(res.data.message);
        }
      } else {
        const res = await axios.post(
          `${USER_API_END_POINT}/register`,
          { name, username, email: emailOrUsername, password },
          {
            headers: {
              'Content-Type': "application/json"
            },
            withCredentials: true
          }
        );
        
        if (res.data.success) {
          setIsLogin(true);
          toast.success(res.data.message);
          setName("");
          setUsername("");
          setEmailOrUsername("");
          setPassword("");
        }
      }
    } catch (error) {
      let errorMessage = isLogin ? "Login failed" : "Registration failed";
      
      if (error.response) {
        errorMessage = error.response.data?.message || 
                     (error.response.status === 401 ? "Invalid credentials" : errorMessage);
      } else if (error.request) {
        errorMessage = "No response from server. Please try again.";
      }
      
      toast.error(errorMessage, {
        duration: 4000,
        position: 'top-center'
      });
      
      console.error("Auth error:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleAuthMode = useCallback(() => {
    setIsLogin((prev) => !prev);
    setName("");
    setUsername("");
    setEmailOrUsername("");
    setPassword("");
  }, []);

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
                  required
                />
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  type="text"
                  placeholder="Username"
                  className="outline-[#048193] border-2 border-[#1C8D9F] px-3 py-2 rounded-full my-1 font-semibold"
                  required
                />
              </>
            )}
            <input
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
              type={isLogin ? "text" : "email"}
              placeholder={isLogin ? "Email or Username" : "Email"}
              className="outline-[#048193] border-2 border-[#1C8D9F] px-3 py-2 rounded-full my-1 font-semibold"
              required
            />
            <div className="relative">
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="outline-[#048193] border-2 border-[#1C8D9F] px-3 py-2 rounded-full my-1 font-semibold w-full pr-10"
                required
                minLength={6}
              />
              <span
                className="absolute right-3 top-4 cursor-pointer text-[#0A5F70]"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaRegEyeSlash size={22} /> : <FaRegEye size={22} />}
              </span>
            </div>

            <button
              type="submit"
              className="bg-[#0A5F70] my-4 py-2 border-none rounded-full text-lg text-white font-semibold hover:bg-[#084a58] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? "Processing..." : isLogin ? "Sign In" : "Create Account"}
            </button>
            
            <h1 className="ml-1">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <span
                onClick={toggleAuthMode}
                className="font-bold text-[#0A5F70] cursor-pointer hover:underline"
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