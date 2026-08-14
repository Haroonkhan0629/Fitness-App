'use client';

import { useState, useEffect } from 'react';
import { Table } from 'reactstrap';
import { getUserHello } from '@/app/actions';

export default function UserPage({ profile, logout, theme }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!profile) {
      setData(null);
      return;
    }
    getUserHello()
      .then((res) => setData(res?.message))
      .catch(console.error);
  }, [profile]);

  const tableVariant = theme === 'dark' ? 'dark' : 'light';
  const breadcrumb =
    theme === 'light' ? (
      <li className="breadcrumb-item active" aria-current="page">Profile</li>
    ) : (
      <li aria-current="page">Profile</li>
    );

  return (
    <div>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">{breadcrumb}</ol>
      </nav>
      <Table {...{ [tableVariant]: true }}>
        <tbody>
          <tr>
            <td>
              <img className="profile-img" src={profile.picture} alt={profile.name} />
            </td>
            <td align="center">
              <button onClick={logout} className="logout">Logout</button>
            </td>
          </tr>
          <tr>
            <td>
              <h2>Welcome, {profile.name}!</h2>
            </td>
            <td align="center">
              <h3>Mail ID: {profile.email}</h3>
            </td>
          </tr>
        </tbody>
      </Table>
      <h1>{data}</h1>
    </div>
  );
}
