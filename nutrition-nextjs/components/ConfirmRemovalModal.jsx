'use client';

import { useState, Fragment } from 'react';
import { Modal, ModalHeader, Button, ModalFooter } from 'reactstrap';
import { deleteExercise } from '@/app/actions';

export default function ConfirmRemovalModal({ id, resetState, theme }) {
  const [modal, setModal] = useState(false);
  const toggle = () => setModal((prev) => !prev);
  const isDark = theme === 'dark';

  const handleDelete = () => {
    deleteExercise(id).then(() => {
      resetState();
      toggle();
    }).catch(console.error);
  };

  return (
    <Fragment>
      <Button color="danger" onClick={toggle}>Remove</Button>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader
          toggle={toggle}
          style={isDark ? { backgroundColor: '#333', color: 'whitesmoke' } : {}}
        >
          Do you really want to delete this exercise?
        </ModalHeader>
        <ModalFooter style={isDark ? { backgroundColor: '#333' } : {}}>
          <Button type="button" onClick={toggle}>Cancel</Button>
          <Button type="button" color="primary" onClick={handleDelete}>Yes</Button>
        </ModalFooter>
      </Modal>
    </Fragment>
  );
}
