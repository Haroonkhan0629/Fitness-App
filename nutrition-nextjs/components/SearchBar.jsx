'use client';

import { useState, useRef } from 'react';
import { FaSearch } from 'react-icons/fa';
import { getExercises } from '@/app/actions';

export default function SearchBar({ setResults, isLoggedIn }) {
  const [input, setInput] = useState('');
  const latestSearchRef = useRef('');

  const fetchData = async (searchedValue) => {
    latestSearchRef.current = searchedValue;
    try {
      const data = await getExercises(isLoggedIn);
      if (latestSearchRef.current !== searchedValue) return;
      const results = data.filter(
        (result) =>
          searchedValue &&
          result &&
          result.name &&
          result.name.toLowerCase().includes(searchedValue.toLowerCase())
      );
      setResults(results);
    } catch (err) {
      console.error('Search error:', err);
    }
  };

  const handleChange = (value) => {
    setInput(value);
    fetchData(value);
  };

  return (
    <div className="input-wrapper">
      <FaSearch id="search-icon" />
      <input
        className="search-input"
        placeholder="Search..."
        value={input}
        onChange={(e) => handleChange(e.target.value)}
      />
    </div>
  );
}
