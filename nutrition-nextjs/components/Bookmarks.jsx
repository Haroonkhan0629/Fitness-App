'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth';
import BookmarksList from './BookmarksList';
import { getExercises } from '@/app/actions';

export default function Bookmarks() {
  const { profile, apiToken, theme } = useAuth();
  const [exercises, setExercises] = useState([]);

  const loadExercises = () => {
    getExercises(apiToken, !!apiToken).then(setExercises).catch(console.error);
  };

  const resetState = () => loadExercises();

  useEffect(() => {
    loadExercises();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiToken]);

  if (!profile) {
    return <p style={{ padding: '1rem' }}>Please log in to view your saved exercises.</p>;
  }

  const breadcrumb =
    theme === 'light' ? (
      <li className="breadcrumb-item active" aria-current="page">Saved</li>
    ) : (
      <li aria-current="page">Saved</li>
    );

  return (
    <div>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">{breadcrumb}</ol>
      </nav>
      <BookmarksList
        exercises={exercises}
        resetState={resetState}
        profile={profile}
        theme={theme}
      />
    </div>
  );
}
