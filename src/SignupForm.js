import { React, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const BACKEND_URL = "http://localhost:8000"; // todo: put in .env

function SignupForm(props) {
  const [username, setUsername] = useState("");
  const [pwd, setPwd] = useState("");
  const [pwdValidate, setPwdValidate] = useState("");

  const navigate = useNavigate();

  const [message, setMsg] = useState("");

  function submitForm(e) {
    e.preventDefault(); // Prevent page from reloading
    makeSignupCall().then((response) => {
      if (response && response.status === 201) {
        const token = response.data;
        setUsername("");
        setPwd("");
        setPwdValidate("");
        setMsg("");
        props.setToken(token);
        alert("Successfully signed up");
        navigate("/users-table");
      } else {
        setMsg("Invalid signup credentials! Passwords must have at least 3 characters.");
      }
    });
  }

  async function makeSignupCall() {
    try {
      const person = { username: username, pwd: pwd, pwdValidate: pwdValidate };
      const response = await axios.post(`${BACKEND_URL}/signup`, person);
      // console.log("makeSignupCall response:", response);
      return response;
    } catch (error) {
      console.log(error);
      if (error.response && error.response.status === 400) {
        return error.response;
      }
      return false;
    }
  }

  return (
    <>
      <h2>Register</h2>

      {message && <div style={{ color: "red" }}>{message}</div>}

      <form onSubmit={submitForm}>
        Username
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <br />
        Password
        <input
          type="password"
          value={pwd}
          onChange={(e) => setPwd(e.target.value)}
          required
        />
        <br />
        Verify Password
        <input
          type="password"
          value={pwdValidate}
          onChange={(e) => setPwdValidate(e.target.value)}
          required
        />
        <br />
        <button type="submit">Signup</button>
      </form>
    </>
  );
}
export default SignupForm;