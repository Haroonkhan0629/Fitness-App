'use client';

import { Button } from 'reactstrap';
import axios from 'axios';
import { API_URL } from '@/constants';

export default function DetailView({ exercise, profile, resetState, toggle, apiToken }) {
  const toggleSave = (e) => {
    e.preventDefault();
    const config = apiToken ? { headers: { Authorization: `Bearer ${apiToken}` } } : {};
    axios.put(`${API_URL}${exercise.id}/bookmarks/`, {}, config).then(() => {
      if (resetState) resetState();
    });
  };

  return (
    <div>
      <p>Muscle: {exercise.muscle}</p>
      <p>Difficulty: {exercise.difficulty}/10</p>
      <p>{exercise.description}</p>
      <div>
        <img className="exercise-image" src={exercise.image} alt="none" />
      </div>
      {profile && (
        <Button style={{ textAlign: 'center' }} onClick={toggleSave}>
          {exercise.saved ? 'Unsave' : 'Save'}
        </Button>
      )}
    </div>
  );
}
