'use client';

import { useState, Fragment } from 'react';
import { Button, Modal, ModalHeader, ModalBody } from 'reactstrap';
import DetailView from './DetailView';

export default function DetailModal({ exercise, profile, resetState, theme }) {
  const [modal, setModal] = useState(false);
  const toggle = () => setModal((prev) => !prev);

  const isDark = theme === 'dark';
  const buttonStyle = isDark
    ? { backgroundColor: '#333', color: 'whitesmoke', border: 'none' }
    : { backgroundColor: 'white', color: 'black', border: 'none' };

  return (
    <Fragment>
      <Button className="view-button" style={buttonStyle} onClick={toggle}>
        {exercise.name}
      </Button>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader
          style={isDark ? { backgroundColor: '#333', color: 'whitesmoke' } : {}}
        >
          {exercise.name}
        </ModalHeader>
        <ModalBody style={isDark ? { backgroundColor: '#333', color: 'whitesmoke' } : {}}>
          <DetailView
            resetState={resetState}
            toggle={toggle}
            exercise={exercise}
            profile={profile}
          />
        </ModalBody>
      </Modal>
    </Fragment>
  );
}
