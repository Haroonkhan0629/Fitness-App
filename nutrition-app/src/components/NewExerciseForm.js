import React from "react";
import { Button, Form, FormGroup, Input, Label } from "reactstrap";

import axios from "axios";

import { API_URL, CREATE_URL } from "../constants";

class NewExerciseForm extends React.Component {
    // Stores all form fields for creating or editing an exercise.
    state = {
        id: 0,
        name: '',
        muscle: '',
        difficulty: '',
        description: '',
        image: ''
    }

    componentDidMount() {
        // If an existing exercise is provided, pre-fill the form for editing.
        if (this.props.exercise) {
            const { id, name, muscle, difficulty, description, image } = this.props.exercise
            this.setState({ id, name, muscle, difficulty, description, image })
        }
    }

    // Updates only the field that the user just typed into.
    onChange = e => {
        this.setState({ [e.target.name]: e.target.value })
    }

    // Sends a new exercise to the backend, then refreshes and closes modal.
    createExercise = e => {
        e.preventDefault()
        axios.post(CREATE_URL, this.state).then(() => {
            this.props.resetState()
            this.props.toggle()
        })
    }

    // Saves edits for an existing exercise, then refreshes and closes modal.
    editExercise = e => {
        e.preventDefault()
        axios.put(API_URL + this.state.id + "/", this.state).then(() => {
            this.props.resetState()
            this.props.toggle()
        })
    }

    // Keeps controlled inputs safe by always returning a string value.
    defaultIfEmpty = (value) => {
        return value === "" ? "" : value;
    };
    render() {
        return (
            <Form onSubmit={this.props.exercise ? this.editExercise : this.createExercise} >
                <FormGroup>
                    <Label for="name">Name:</Label>
                    <Input
                        type="text"
                        name="name"
                        onChange={this.onChange}
                        value={this.defaultIfEmpty(this.state.name)}
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="muscle">muscle:</Label>
                    <Input
                        type="text"
                        name="muscle"
                        onChange={this.onChange}
                        value={this.defaultIfEmpty(this.state.muscle)}
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="difficulty">difficulty:</Label>
                    <Input
                        type="text"
                        name="difficulty"
                        onChange={this.onChange}
                        value={this.defaultIfEmpty(this.state.difficulty)}
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="description">description:</Label>
                    <Input
                        type="text"
                        name="description"
                        onChange={this.onChange}
                        value={this.defaultIfEmpty(this.state.description)}
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="image">Image:</Label>
                    <Input
                        type="text"
                        name="image"
                        onChange={this.onChange}
                        value={this.defaultIfEmpty(this.state.image)}
                    />
                </FormGroup>
                <Button>Send</Button>
            </Form>
        );
    }
}

export default NewExerciseForm;