import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Table } from "reactstrap";
import { AUTH_BASE_URL } from '../constants';

function UserPage({ profile, logout, theme, apiToken }) {
  // Stores welcome message returned by protected endpoint.
  const [data, setData] = useState(null);

  // Uses saved token to call a protected endpoint.
  useEffect(() => {
    if (!apiToken) {
      setData(null);
      return;
    }

    axios.get(`${AUTH_BASE_URL}hello/`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + apiToken
      }
    }).then((response) => {
      console.log(response['data']);
      setData(response['data']['message']);
    }, (error) => {
      console.log(error);
    }
    );
  }, [apiToken]);

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

