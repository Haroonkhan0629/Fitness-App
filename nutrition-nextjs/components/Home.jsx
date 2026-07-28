'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth';
import ExerciseList from './ExerciseList';
import NewExerciseModal from './NewExerciseModal';
import axios from 'axios';
import { API_URL } from '@/constants';

export default function Home() {
  const { profile, apiToken, theme } = useAuth();
  const [exercises, setExercises] = useState([]);

  const getExercises = () => {
    const config = apiToken
      ? { headers: { Authorization: `Bearer ${apiToken}` }, params: { mine: 1 } }
      : {};
    axios.get(API_URL, config).then((res) => setExercises(res.data));
  };

  const resetState = () => getExercises();

  useEffect(() => {
    getExercises();
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
        apiToken={apiToken}
        theme={theme}
      />
      <NewExerciseModal create={true} resetState={resetState} apiToken={apiToken} theme={theme} />
    </div>
  );
}
