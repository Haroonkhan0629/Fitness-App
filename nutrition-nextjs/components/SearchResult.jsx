'use client';

import DetailModal from './DetailModal';

export default function SearchResult({ result, profile, apiToken, theme }) {
  return (
    <div className="result">
      <h4>
        <DetailModal exercise={result} profile={profile} apiToken={apiToken} theme={theme} />
      </h4>
    </div>
  );
}
