'use client';

import { useState, useEffect } from 'react';
import { Button, Form, FormGroup, Input, Label } from 'reactstrap';
import { createExercise, updateExercise } from '@/app/actions';
import { useAuth } from '@/context/auth';

export default function NewExerciseForm({ exercise, resetState, toggle }) {
  const { apiToken } = useAuth();
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

  const handleCreate = (e) => {
    e.preventDefault();
    createExercise(apiToken, form)
      .then(() => { resetState(); toggle(); })
      .catch((error) => console.log('Create exercise failed:', error));
  };

  const handleEdit = (e) => {
    e.preventDefault();
    updateExercise(apiToken, form.id, form)
      .then(() => { resetState(); toggle(); })
      .catch(console.error);
  };

  return (
    <Form onSubmit={exercise ? handleEdit : handleCreate}>
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
