'use client';

import { useAuth } from '@/context/auth';
import ThemeToggle from './ThemeToggle';
import { Table } from 'reactstrap';

export default function Settings() {
  const { theme, setTheme } = useAuth();
  const tableVariant = theme === 'dark' ? 'dark' : 'light';
  const breadcrumb =
    theme === 'light' ? (
      <li className="breadcrumb-item active" aria-current="page">Settings</li>
    ) : (
      <li aria-current="page">Settings</li>
    );

  return (
    <div>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">{breadcrumb}</ol>
      </nav>
      <Table {...{ [tableVariant]: true }}>
        <tbody>
          <tr>
            <td>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</td>
            <td align="center">
              <ThemeToggle theme={theme} setTheme={setTheme} />
            </td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
}
