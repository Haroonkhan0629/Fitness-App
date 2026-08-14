'use client';

import DetailModal from './DetailModal';

export default function SearchResult({ result, profile, theme }) {
  return (
    <div className="result">
      <h4>
        <DetailModal exercise={result} profile={profile} theme={theme} />
      </h4>
    </div>
  );
}
