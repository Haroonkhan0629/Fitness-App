'use client';

import { Button } from 'reactstrap';
import { toggleBookmark } from '@/app/actions';

export default function DetailView({ exercise, profile, resetState, toggle }) {
  const toggleSave = (e) => {
    e.preventDefault();
    toggleBookmark(exercise.id).then(() => {
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
