import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const BACKEND_URL = "http://localhost:8000"; // todo: put in .env

function LoginForm(props) {
  const [user, setUser] = useState({
    username: "",
    pwd: "",
  });

  const navigate = useNavigate();

  const [message, setMsg] = useState("");

  function submitForm(e) {
    e.preventDefault(); // Prevent page from reloading
    makeLoginCall(user).then((response) => {
      if (response && response.status === 200) {
        const token = response.data;
        setUser({ username: "", pwd: "" });
        setMsg("");
        props.setToken(token);
        navigate("/users-table");
      } else {
        setMsg("Invalid login credentials!");
      }
    });
  }

  async function makeLoginCall(user) {
    try {
      const response = await axios.post(`${BACKEND_URL}/login`, user);
      return response;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  return (
    <form>
      <label htmlFor="name">Username</label>
      <input
        type="text"
        name="username"
        id="username"
        value={user.username}
        onChange={(event) => setUser({ ...user, username: event.target.value })}
      />
      <label htmlFor="job">Password</label>
      <input
        type="password"
        name="pwd"
        id="pwd"
        value={user.pwd}
        onChange={(event) => setUser({ ...user, pwd: event.target.value })}
      />
      <input type="button" value="Submit" onClick={submitForm} />
      <i> {message} </i>
    </form>
  );
}

export default LoginForm;
