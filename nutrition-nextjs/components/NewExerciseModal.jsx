'use client';

import { useState, Fragment } from 'react';
import { Button, Modal, ModalHeader, ModalBody } from 'reactstrap';
import NewExerciseForm from './NewExerciseForm';

export default function NewExerciseModal({ create, exercise, resetState, apiToken, theme }) {
  const [modal, setModal] = useState(false);
  const toggle = () => setModal((prev) => !prev);
  const isDark = theme === 'dark';

  const title = create ? 'Creating exercise' : 'Editing exercise';
  const button = create ? (
    <Button
      color="primary"
      className="float-right create-button"
      onClick={toggle}
      style={{ minWidth: '200px' }}
    >
      Create
    </Button>
  ) : (
    <Button onClick={toggle}>Edit</Button>
  );

  return (
    <Fragment>
      {button}
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader
          toggle={toggle}
          style={isDark ? { backgroundColor: '#333', color: 'whitesmoke' } : {}}
        >
          {title}
        </ModalHeader>
        <ModalBody style={isDark ? { backgroundColor: '#333', color: 'whitesmoke' } : {}}>
          <NewExerciseForm
            resetState={resetState}
            toggle={toggle}
            exercise={exercise}
            apiToken={apiToken}
          />
        </ModalBody>
      </Modal>
    </Fragment>
  );
}
