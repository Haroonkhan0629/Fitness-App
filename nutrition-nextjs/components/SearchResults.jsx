'use client';

import SearchResult from './SearchResult';

export default function SearchResults({ results, profile, theme }) {
  return (
    <div className="results">
      {results.map((result, id) => (
        <SearchResult
          key={id}
          result={result}
          profile={profile}
          theme={theme}
        />
      ))}
    </div>
  );
}
