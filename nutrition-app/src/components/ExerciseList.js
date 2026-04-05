import React, { Component } from "react";
import { Table } from "reactstrap";
import NewExerciseModal from "./NewExerciseModal";
import ConfirmRemovalModal from "./ConfirmRemovalModal";
import DetailModal from "./DetailModal";

class ExerciseList extends Component {
    render() {
        const exercises = this.props.exercises;
        const profile = this.props.profile
        const theme = this.props.theme
        // Logged-in users can edit and remove exercises.
        if (profile) {
            if (theme === 'light') {
                // Show placeholder row when API returns no exercises.
                return (
                    <div className="table-responsive">
                        <Table light>
                            <thead>
                                <tr>
                                    <th>Exercise</th>
                                </tr>
                            </thead>
                            <tbody>
                                {!exercises || exercises.length <= 0 ? (
                                    <tr>
                                        <td colSpan="6" align="center">
                                            <b>Exercises Loading... May take a minute.</b>
                                        </td>
                                    </tr>
                                ) : (
                                    exercises.map(exercise => (
                                        <tr key={exercise.id}>
                                            <td> <DetailModal
                                                exercise={exercise}
                                                profile={profile}
                                                theme={theme}
                                            /></td>
                                            <td align="center">
                                                <NewExerciseModal
                                                    create={false}
                                                    exercise={exercise}
                                                    resetState={this.props.resetState}
                                                    theme={theme}
                                                />
                                                &nbsp;&nbsp;
                                                <ConfirmRemovalModal
                                                    id={exercise.id}
                                                    resetState={this.props.resetState}
                                                    theme={theme}
                                                />
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </Table>
                    </div>
                );
            } else if (theme === 'dark') {
                // Show placeholder row when API returns no exercises.
                return (
                    <div className="table-responsive">
                        <Table dark>
                            <thead>
                                <tr>
                                    <th>Exercise</th>
                                </tr>
                            </thead>
                            <tbody>
                                {!exercises || exercises.length <= 0 ? (
                                    <tr>
                                        <td colSpan="6" align="center">
                                            <b>Exercises Loading... May take a minute.</b>
                                        </td>
                                    </tr>
                                ) : (
                                    exercises.map(exercise => (
                                        <tr key={exercise.id}>
                                            <td> <DetailModal
                                                exercise={exercise}
                                                profile={profile}
                                                theme={theme}
                                            /></td>
                                            <td align="center">
                                                <NewExerciseModal
                                                    create={false}
                                                    exercise={exercise}
                                                    resetState={this.props.resetState}
                                                    theme={theme}
                                                />
                                                &nbsp;&nbsp;
                                                <ConfirmRemovalModal
                                                    id={exercise.id}
                                                    resetState={this.props.resetState}
                                                    theme={theme}
                                                />
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </Table>
                    </div>
                );
            }




        } else {
            if (theme === 'light') {
                // Guests can browse details, but edit/remove actions are hidden.
                return (
                    <div className="table-responsive">
                        <Table light>
                            <thead>
                                <tr>
                                    <th>Exercise</th>
                                </tr>
                            </thead>
                            <tbody>
                                {!exercises || exercises.length <= 0 ? (
                                    <tr>
                                        <td colSpan="6" align="center">
                                            <b>Exercises Loading... May take a minute.</b>
                                        </td>
                                    </tr>
                                ) : (
                                    exercises.map(exercise => (
                                        <tr key={exercise.id}>
                                            <td> <DetailModal
                                                exercise={exercise}
                                                profile={profile}
                                                theme={theme}
                                            /></td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </Table>
                    </div>
                )
            } else if (theme === 'dark') {
                // Guests can browse details, but edit/remove actions are hidden.
                return (
                    <div className="table-responsive">
                        <Table dark>
                            <thead>
                                <tr>
                                    <th>Exercise</th>
                                </tr>
                            </thead>
                            <tbody>
                                {!exercises || exercises.length <= 0 ? (
                                    <tr>
                                        <td colSpan="6" align="center">
                                            <b>Exercises Loading... May take a minute.</b>
                                        </td>
                                    </tr>
                                ) : (
                                    exercises.map(exercise => (
                                        <tr key={exercise.id}>
                                            <td> <DetailModal
                                                exercise={exercise}
                                                profile={profile}
                                                theme={theme}
                                            /></td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </Table>
                    </div>
                )
            }
        }
    }
}

export default ExerciseList