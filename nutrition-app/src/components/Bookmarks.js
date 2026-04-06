import React, { Component } from "react";
import BookmarksList from "./BookmarksList";

import axios from "axios";

import { API_URL } from "../constants";

class Bookmarks extends Component {
    // Holds all exercises returned by the API.
    state = {
        exercises: []
    };

    // Loads data once when this screen opens.
    componentDidMount() {
        this.resetState();
    }

    // Re-fetches whenever the user logs in or out so the correct exercises show.
    componentDidUpdate(prevProps) {
        if (prevProps.apiToken !== this.props.apiToken) {
            this.resetState();
        }
    }

    // Gets the latest exercise list from backend, including auth token if logged in.
    getExercise = () => {
        const { apiToken } = this.props;
        const config = apiToken ? { headers: { Authorization: `Token ${apiToken}` } } : {};
        axios.get(API_URL, config).then(res => this.setState({ exercises: res.data }));
    };

    // Central refresh helper used by child components.
    resetState = () => {
        this.getExercise();
    };

    render() {
        const profile = this.props.profile
        const theme = this.props.theme
        if (profile) {
            if (theme === 'light') {
                return (
                    <div>
                        <nav aria-label="breadcrumb">
                            <ol class="breadcrumb">
                                <li class="breadcrumb-item active" aria-current="page">Saved</li>
                            </ol>
                        </nav>
                        <BookmarksList
                            exercises={this.state.exercises}
                            resetState={this.resetState}
                            profile={profile}
                            apiToken={this.props.apiToken}
                            theme={theme}
                        />
                    </div>
                );
            } else if (theme === 'dark') {
                return (
                    <div>
                        <nav aria-label="breadcrumb">
                            <ol class="breadcrumb">
                                <li aria-current="page">Saved</li>
                            </ol>
                        </nav>
                        <BookmarksList
                            exercises={this.state.exercises}
                            resetState={this.resetState}
                            profile={profile}
                            apiToken={this.props.apiToken}
                            theme={theme}
                        />
                    </div>
                );
            }
        } else {
            return (
                <div>
                    <div className="login-container">
                        <h2>
                            Only Users Can Save Exercises
                        </h2>
                    </div>
                </div>
            )
        }
    }
}

export default Bookmarks;