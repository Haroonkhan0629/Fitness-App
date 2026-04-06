import React, { Component } from "react";
import { Button } from "reactstrap";
import axios from "axios";

import { API_URL } from "../constants";

class DetailView extends Component {
    render() {
        const exercise = this.props.exercise
        const profile = this.props.profile
        const apiToken = this.props.apiToken

        // Toggles bookmark status for this exercise on the server.
        const toggleSave = (e) => {
            e.preventDefault()
            const config = apiToken ? { headers: { Authorization: `Token ${apiToken}` } } : {}
            axios.put(API_URL + exercise.id + "/bookmarks/", {}, config).then(() => {
                if (this.props.resetState) {
                    this.props.resetState()
                }
            })
        }

        if (profile) {
            return (
                <div>
                    <p>Muscle: {exercise.muscle} </p>
                    <p>Difficulty: {exercise.difficulty}/10 </p>
                    <p>{exercise.description} </p>
                    <div>
                        <img className="exercise-image" src={exercise.image} alt="none" />
                    </div>
                    {exercise.saved === false ? (
                        <Button style={{ textAlign: "center" }} onClick={toggleSave}>Save</Button>
                    ) : (
                        <Button style={{ textAlign: "center" }} onClick={toggleSave}>Unsave</Button>
                    )}
                </div>
            )
        } else {
            return (
                <div>
                    <p>Muscle: {exercise.muscle} </p>
                    <p>Difficulty: {exercise.difficulty}/10 </p>
                    <p>{exercise.description} </p>
                    <div>
                        <img className="exercise-image" src={exercise.image} alt="none" />
                    </div>
                </div>
            )
        }
    }
}

export default DetailView