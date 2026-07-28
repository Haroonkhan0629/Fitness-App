'use client';

import { useState, useRef } from 'react';
import { FaSearch } from 'react-icons/fa';
import axios from 'axios';
import { API_URL } from '@/constants';

export default function SearchBar({ setResults, apiToken }) {
  const [input, setInput] = useState('');
  const controllerRef = useRef(null);

  const fetchData = async (searchedValue) => {
    if (controllerRef.current) {
      controllerRef.current.abort();
    }
    const controller = new AbortController();
    controllerRef.current = controller;

    try {
      const config = apiToken
        ? {
            headers: { Authorization: `Bearer ${apiToken}` },
            params: { mine: 1 },
            signal: controller.signal,
          }
        : { signal: controller.signal };

      const response = await axios.get(API_URL, config);
      const results = response.data.filter(
        (result) =>
          searchedValue &&
          result &&
          result.name &&
          result.name.toLowerCase().includes(searchedValue.toLowerCase())
      );
      setResults(results);
    } catch (err) {
      if (!axios.isCancel(err)) {
        console.error('Search error:', err);
      }
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
