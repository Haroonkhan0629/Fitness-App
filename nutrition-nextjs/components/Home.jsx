'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth';
import ExerciseList from './ExerciseList';
import NewExerciseModal from './NewExerciseModal';
import { getExercises } from '@/app/actions';

export default function Home() {
  const { profile, apiToken, theme } = useAuth();
  const [exercises, setExercises] = useState([]);

  const loadExercises = () => {
    getExercises(apiToken, !!apiToken).then(setExercises).catch(console.error);
  };

  const resetState = () => loadExercises();

  useEffect(() => {
    loadExercises();
  // Re-fetch when login state changes.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiToken]);

  const breadcrumb =
    theme === 'light' ? (
      <li className="breadcrumb-item active" aria-current="page">Exercises</li>
    ) : (
      <li aria-current="page">Exercises</li>
    );

  return (
    <div>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">{breadcrumb}</ol>
      </nav>
      <ExerciseList
        exercises={exercises}
        profile={profile}
        resetState={resetState}
        theme={theme}
      />
      {profile && (
        <NewExerciseModal create={true} resetState={resetState} theme={theme} />
      )}
    </div>
  );
}
