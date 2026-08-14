'use client';

import { Table } from 'reactstrap';
import NewExerciseModal from './NewExerciseModal';
import ConfirmRemovalModal from './ConfirmRemovalModal';
import DetailModal from './DetailModal';

export default function ExerciseList({ exercises, profile, resetState, theme }) {
  const tableVariant = theme === 'dark' ? 'dark' : 'light';

  return (
    <div className="table-responsive">
      <Table {...{ [tableVariant]: true }}>
        <thead>
          <tr><th>Exercise</th></tr>
        </thead>
        <tbody>
          {!exercises || exercises.length === 0 ? (
            <tr>
              <td colSpan="6" align="center">
                <p>Exercises Loading... May take a minute.</p>
              </td>
            </tr>
          ) : (
            exercises.map((exercise) => (
              <tr key={exercise.id}>
                <td>
                  <DetailModal
                    exercise={exercise}
                    profile={profile}
                    resetState={resetState}
                    theme={theme}
                  />
                </td>
                {profile && (
                  <td align="center">
                    <NewExerciseModal
                      create={false}
                      exercise={exercise}
                      resetState={resetState}
                      theme={theme}
                    />
                    &nbsp;&nbsp;
                    <ConfirmRemovalModal
                      id={exercise.id}
                      resetState={resetState}
                      theme={theme}
                    />
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </div>
  );
}
