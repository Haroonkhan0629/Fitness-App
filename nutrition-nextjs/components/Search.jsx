'use client';

import { useState } from 'react';
import { useAuth } from '@/context/auth';
import SearchBar from './SearchBar';
import SearchResults from './SearchResults';

export default function Search() {
  const { profile, isLoggedIn, theme } = useAuth();
  const [results, setResults] = useState([]);

  return (
    <ul className="navigation">
      <li className="search-bar-container">
        <SearchBar setResults={setResults} isLoggedIn={isLoggedIn} />
        <SearchResults results={results} profile={profile} theme={theme} />
      </li>
    </ul>
  );
}
