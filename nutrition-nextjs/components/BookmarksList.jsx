'use client';

import { Table } from 'reactstrap';
import DetailModal from './DetailModal';

export default function BookmarksList({ exercises, profile, resetState, theme }) {
  const bookmarked = exercises.filter((exercise) => exercise.saved === true);
  const tableVariant = theme === 'dark' ? 'dark' : 'light';

  return (
    <div className="table-responsive">
      <Table {...{ [tableVariant]: true }}>
        <thead>
          <tr>
            <th>Exercise</th>
          </tr>
        </thead>
        <tbody>
          {bookmarked.map((bookmark) => (
            <tr key={bookmark.id}>
              <td>
                <DetailModal
                  exercise={bookmark}
                  profile={profile}
                  resetState={resetState}
                  theme={theme}
                />
              </td>
              <td align="center" />
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
