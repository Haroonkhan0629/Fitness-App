import React, { Component } from "react";
import ExerciseList from "./ExerciseList";
import NewExerciseModal from "./NewExerciseModal";
import { Link } from "react-router-dom";

import axios from "axios";

import { API_URL } from "../constants";

class Home extends Component {
  // Holds the exercise records shown in the table.
  state = {
    exercises: []
  };

  // Fetches data as soon as this page loads.
  componentDidMount() {
    this.resetState();
  }

  // Re-fetches whenever the user logs in or out so the correct exercises show.
  componentDidUpdate(prevProps) {
    if (prevProps.apiToken !== this.props.apiToken) {
      this.resetState();
    }
  }

  // Calls the API and stores exercises, including the auth token if logged in.
  getExercise = () => {
    const { apiToken } = this.props;
    const config = apiToken ? { headers: { Authorization: `Token ${apiToken}` } } : {};
    axios.get(API_URL, config).then(res => this.setState({ exercises: res.data }));
  };

  // Shared refresh function passed to child components.
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
                <li class="breadcrumb-item"><Link to="/">Home</Link></li>
                <li class="breadcrumb-item active" aria-current="page">Exercises</li>
              </ol>
            </nav>
            <ExerciseList
              exercises={this.state.exercises}
              profile={profile}
              resetState={this.resetState}
              theme={theme}
            />
            <NewExerciseModal create={true} resetState={this.resetState} theme={theme}/>
          </div>
        );
      } else if (theme === 'dark') {
        return (
          <div>
            <nav aria-label="breadcrumb">
              <ol class="breadcrumb">
                <li class="breadcrumb-item"><Link to="/">Home</Link></li>
                <li aria-current="page">/ Exercises</li>
              </ol>
            </nav>
            <ExerciseList
              exercises={this.state.exercises}
              profile={profile}
              resetState={this.resetState}
              theme={theme}
            />
            <NewExerciseModal create={true} resetState={this.resetState} theme={theme}/>
          </div>
        );
      }
    } else {
      if (theme === 'light') {
        return (
          <div className="table-margin">
            <nav aria-label="breadcrumb">
              <ol class="breadcrumb">
                <li class="breadcrumb-item"><Link to="/">Home</Link></li>
                <li class="breadcrumb-item active" aria-current="page">Exercises</li>
              </ol>
            </nav>
            <ExerciseList
              exercises={this.state.exercises}
              profile={profile}
              resetState={this.resetState}
              theme={theme}
            />
          </div>
        )
      } else if (theme === 'dark') {
        return (
          <div className="table-margin">
            <nav aria-label="breadcrumb">
              <ol class="breadcrumb">
                <li class="breadcrumb-item"><Link to="/">Home</Link></li>
                <li aria-current="page">/ Exercises</li>
              </ol>
            </nav>
            <ExerciseList
              exercises={this.state.exercises}
              profile={profile}
              resetState={this.resetState}
              theme={theme}
            />
          </div>
        )
      }
    }
  }
}

export default Home;