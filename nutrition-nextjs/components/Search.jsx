'use client';

import { useState } from 'react';
import { useAuth } from '@/context/auth';
import SearchBar from './SearchBar';
import SearchResults from './SearchResults';

export default function Search() {
  const { profile, apiToken, theme } = useAuth();
  const [results, setResults] = useState([]);

  return (
    <ul className="navigation">
      <li className="search-bar-container">
        <SearchBar setResults={setResults} apiToken={apiToken} />
        <SearchResults results={results} profile={profile} apiToken={apiToken} theme={theme} />
      </li>
    </ul>
  );
}
