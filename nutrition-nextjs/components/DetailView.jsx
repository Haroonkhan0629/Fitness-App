'use client';

import { Button } from 'reactstrap';
import { toggleBookmark } from '@/app/actions';
import { useAuth } from '@/context/auth';

export default function DetailView({ exercise, profile, resetState, toggle }) {
  const { apiToken } = useAuth();
  const toggleSave = (e) => {
    e.preventDefault();
    toggleBookmark(apiToken, exercise.id).then(() => {
      if (resetState) resetState();
    }).catch(console.error);
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
