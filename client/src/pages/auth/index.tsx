import "./styles.css";
import { useState, SyntheticEvent, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { UserErrors } from "../../models/errors";
import { IShopContext, ShopContext } from "../../context/shop-context";

export const AuthPage = () => {
  return (
    <div className="auth">
      <Register />
      <Login />
    </div>
  );
};

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();
    try {
      await axios.post("http://localhost:3001/user/register", {
        username,
        password,
      });
      alert("Registration completed. Please login.");
    } catch (error) {
      if (error?.response?.data?.type === UserErrors.USERNAME_ALREADY_EXISTS) {
        alert("Error: User already in use");
      } else {
        alert("Error: Something went wrong");
      }
    }
  };
  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit}>
        <h2>Register</h2>
        <div className="form-group">
          <label htmlFor="username">Username: </label>
          <input
            type="text"
            id="username"
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          ></input>
          <label htmlFor="password">Password: </label>
          <input
            type="password"
            id="password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          ></input>
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
};

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [_, setCookies] = useCookies(["access_token"]);
  const navigate = useNavigate();

  const { setIsAuthenticated } = useContext<IShopContext>(ShopContext);

  const handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();
    try {
      const result = await axios.post("http://localhost:3001/user/login", {
        username,
        password,
      });
      setCookies("access_token", result.data.token);
      localStorage.setItem("userID", result.data.userID);
      setIsAuthenticated(true);
      navigate("/");
    } catch (error) {
      let errorMessage: string = "";
      switch (error.response.data.type) {
        case UserErrors.NO_USER_FOUND:
          errorMessage = "User doesn't exist";
          break;
        case UserErrors.WRONG_CREDENTIALS:
          errorMessage = "Wrong username/password combination";
          break;
        default:
          errorMessage = "Something went wrong";
      }
      alert("Error: " + errorMessage);
    }
  };
  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>
        <div className="form-group">
          <label htmlFor="username">Username: </label>
          <input
            type="text"
            id="username"
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          ></input>
          <label htmlFor="password">Password: </label>
          <input
            type="password"
            id="password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          ></input>
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
};
