'use client';

import SearchResult from './SearchResult';

export default function SearchResults({ results, profile, apiToken, theme }) {
  return (
    <div className="results">
      {results.map((result, id) => (
        <SearchResult
          key={id}
          result={result}
          profile={profile}
          apiToken={apiToken}
          theme={theme}
        />
      ))}
    </div>
  );
}
