'use client';

import { useState, useEffect } from 'react';
import { Button, Form, FormGroup, Input, Label } from 'reactstrap';
import axios from 'axios';
import { API_URL } from '@/constants';

export default function NewExerciseForm({ exercise, resetState, toggle, apiToken }) {
  const [form, setForm] = useState({
    id: 0,
    name: '',
    muscle: '',
    difficulty: '',
    description: '',
    image: '',
  });

  useEffect(() => {
    if (exercise) {
      const { id, name, muscle, difficulty, description, image } = exercise;
      setForm({ id, name, muscle, difficulty, description, image });
    }
  }, [exercise]);

  const onChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const config = apiToken ? { headers: { Authorization: `Bearer ${apiToken}` } } : {};

  const createExercise = (e) => {
    e.preventDefault();
    axios
      .post(API_URL, form, config)
      .then(() => { resetState(); toggle(); })
      .catch((error) => console.log('Create exercise failed:', error?.response?.data || error));
  };

  const editExercise = (e) => {
    e.preventDefault();
    axios
      .put(`${API_URL}${form.id}/`, form, config)
      .then(() => { resetState(); toggle(); });
  };

  return (
    <Form onSubmit={exercise ? editExercise : createExercise}>
      <FormGroup>
        <Label for="name">Name:</Label>
        <Input type="text" name="name" onChange={onChange} value={form.name} />
      </FormGroup>
      <FormGroup>
        <Label for="muscle">Muscle:</Label>
        <Input type="text" name="muscle" onChange={onChange} value={form.muscle} />
      </FormGroup>
      <FormGroup>
        <Label for="difficulty">Difficulty:</Label>
        <Input type="text" name="difficulty" onChange={onChange} value={form.difficulty} />
      </FormGroup>
      <FormGroup>
        <Label for="description">Description:</Label>
        <Input type="text" name="description" onChange={onChange} value={form.description} />
      </FormGroup>
      <FormGroup>
        <Label for="image">Image URL:</Label>
        <Input type="text" name="image" onChange={onChange} value={form.image} />
      </FormGroup>
      <Button>Send</Button>
    </Form>
  );
}
