'use client';

import { useState, Fragment } from 'react';
import { Modal, ModalHeader, Button, ModalFooter } from 'reactstrap';
import axios from 'axios';
import { API_URL } from '@/constants';

export default function ConfirmRemovalModal({ id, resetState, apiToken, theme }) {
  const [modal, setModal] = useState(false);
  const toggle = () => setModal((prev) => !prev);
  const isDark = theme === 'dark';

  const deleteExercise = () => {
    const config = apiToken ? { headers: { Authorization: `Bearer ${apiToken}` } } : {};
    axios.delete(`${API_URL}${id}/`, config).then(() => {
      resetState();
      toggle();
    });
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
          <Button type="button" color="primary" onClick={deleteExercise}>Yes</Button>
        </ModalFooter>
      </Modal>
    </Fragment>
  );
}
