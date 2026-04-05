import React, { Component, Fragment } from "react";
import { Button, Modal, ModalHeader, ModalBody } from "reactstrap";
import DetailView from "./DetailView";

class DetailModal extends Component {
    // Controls whether the detail popup is visible.
    state = {
        modal: false
    };

    // Switches the detail popup between open and closed.
    toggle = () => {
        this.setState(previous => ({
            modal: !previous.modal
        }));
    };

    render() {
        const exercise = this.props.exercise
        const theme = this.props.theme
        
        if (theme === 'light') {
            let button = <Button className="view-button" style={{ backgroundColor: "white", color: "black", border: "none" }} onClick={this.toggle}>{exercise.name}</Button>;
            return (
                <Fragment>
                    {button}
                    <Modal isOpen={this.state.modal} toggle={this.toggle}>
                        <ModalHeader>{exercise.name}</ModalHeader>

                        <ModalBody>
                            <DetailView
                                resetState={this.props.resetState}
                                toggle={this.toggle}
                                exercise={this.props.exercise}
                                profile={this.props.profile}
                            />
                        </ModalBody>
                    </Modal>
                </Fragment>
            )
        } else if (theme === 'dark') {
            let button = <Button className="view-button" style={{ backgroundColor: "#333", color: "whitesmoke", border: "none" }} onClick={this.toggle}>{exercise.name}</Button>;
            return (
                <Fragment>
                    {button}
                    <Modal isOpen={this.state.modal} toggle={this.toggle} >
                        <ModalHeader style={{backgroundColor: "#333", color: "whitesmoke"}}>{exercise.name}</ModalHeader>

                        <ModalBody style={{backgroundColor: "#333", color: "whitesmoke"}}>
                            <DetailView
                                resetState={this.props.resetState}
                                toggle={this.toggle}
                                exercise={this.props.exercise}
                                profile={this.props.profile}
                            />
                        </ModalBody>
                    </Modal>
                </Fragment>
            )
        }
    }
}

export default DetailModal