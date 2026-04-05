import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Table } from "reactstrap";
import { AUTH_BASE_URL } from '../constants';

function UserPage({ profile, logout, theme }) {

  // Stores API token received from backend login.
  const [token, setToken] = useState(null);
  // Stores welcome message returned by protected endpoint.
  const [data, setData] = useState(null);

  // Logs in to backend after a short delay and saves auth token.
  useEffect(() => {
    if (!profile) {
      return;
    }

    const delay = 3000;

    const credentials = {
      username: profile['id'],
      password: 'random123'
    };

    const timeout = setTimeout(() => {
      axios.post(`${AUTH_BASE_URL}login/`, credentials)
        .then((response) => {
          console.log(response['data']);
          setToken(response['data']['token']);
        });
    }, delay);

    return () => clearTimeout(timeout);
  }, [profile]);

  // Uses saved token to call a protected endpoint.
  useEffect(() => {

    axios.get(`${AUTH_BASE_URL}hello/`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + token
      }
    }).then((response) => {
      console.log(response['data']);
      setData(response['data']['message']);
    }, (error) => {
      console.log(error);
    }
    );
  }, [token]);

  if (theme === 'light') {
    return (
      <div>
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb">
            <li class="breadcrumb-item active" aria-current="page">Profile</li>
          </ol>
        </nav>
        <Table light>
          <tbody>
            <tr>
              <td>
                <img className="profile-img" src={profile['picture']} alt={profile['name']} />
              </td>
              <td align="center">
                <button onClick={logout} className='logout'>Logout</button>
              </td>
            </tr>
            <tr>
              <td>
                <h2>Welcome, {profile['name']}!</h2>
              </td>
              <td align="center">
                <h3>Mail ID: {profile['email']}</h3>
              </td>
            </tr>
          </tbody>
        </Table>
        <h1> {data} </h1>
      </div>
    );
  } else if (theme === 'dark') {
    return (
      <div>
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb">
            <li aria-current="page">Profile</li>
          </ol>
        </nav>
        <Table dark>
          <tbody>
            <tr>
              <td>
                <img className="profile-img" src={profile['picture']} alt={profile['name']} />
              </td>
              <td align="center">
                <button onClick={logout} className='logout'>Logout</button>
              </td>
            </tr>
            <tr>
              <td>
                <h2>Welcome, {profile['name']}!</h2>
              </td>
              <td align="center">
                <h3>Mail ID: {profile['email']}</h3>
              </td>
            </tr>
          </tbody>
        </Table>
        <h1> {data} </h1>
      </div>
    );
  }
}

export default UserPage;

