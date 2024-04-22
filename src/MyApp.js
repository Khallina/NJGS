import React, { useState, useEffect } from "react";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import Table from "./Table";
import Form from "./Form";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import { useCookies } from "react-cookie";
import MapImage from './MapImage'; // Import the MapImage component

import axios from "axios";

const BACKEND_URL = "http://localhost:8000";

function MyApp() {
  const [characters, setCharacters] = useState([]);
  const [cookies, setCookie] = useCookies(["auth_token"]);

  function setToken(token) {
    console.log("setToken: ", token);
    setCookie("auth_token", token, {
      maxAge: 1800,
      path: "/",
    });
  }

  useEffect(() => {
    fetchAll().then((result) => {
      if (result) {
        setCharacters(result);
      }
    });
  }, []); //was cookies

  async function fetchAll() {
    try {
      const config = {
        headers: { Authorization: `Bearer ${cookies.auth_token}` },
      };
      if (cookies.auth_token) {
        const response = await axios.get(`${BACKEND_URL}/users`, config);
        console.log(response);
        return response.data.users_list;
      } else {
        console.log("empty cookie");
        return false;
      }
    } catch (error) {
      // We're not handling errors. Just logging into the console.
      console.log(error);
      return false;
    }
  }

  async function makePostCall(person) {
    try {
      const response = await axios.post(`${BACKEND_URL}/users`, person);
      return response;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async function makeDeleteCall(id) {
    try {
      const response = await axios.delete(`${BACKEND_URL}/users/${id}`);
      return response;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  function removeOneCharacter(index) {
    makeDeleteCall(characters[index]._id).then((result) => {
      if (result && result.status === 204) {
        const updated = characters.filter((character, i) => {
          return i !== index;
        });
        setCharacters(updated);
      }
    });
  }

  function updateList(person) {
    makePostCall(person).then((result) => {
      if (result && result.status === 201) {
        setCharacters([...characters, result.data]);
      }
    });
  }

  return (
    <div className="container">
      <BrowserRouter>
        <nav>
          <ul>
            <li>
              <Link to="/users-table">List all</Link>
            </li>
            <li>
              <Link to="/form">Insert one</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/signup">Sign Up</Link>
            </li>
            <li>
              <Link to="/map">Maps</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<h1>Choose your path!</h1>} />
          <Route
            path="/users-table"
            element={
              <Table
                characterData={characters}
                removeCharacter={removeOneCharacter}
              />
            }
          />
          <Route path="/form" element={<Form handleSubmit={updateList} />} />
          <Route path="/login" element={<LoginForm setToken={setToken} />} />
          <Route path="/map" element={<MapImage />} />
          <Route path="/signup" element={<SignupForm setToken={setToken} />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default MyApp;
