import React, { Component, Fragment } from "react";
import { Modal, ModalHeader, Button, ModalFooter } from "reactstrap";

import axios from "axios";

import { API_URL } from "../constants";

class ConfirmRemovalModal extends Component {
  // Tracks whether the confirmation popup is open.
  state = {
    modal: false
  };

  // Opens or closes the popup.
  toggle = () => {
    this.setState(previous => ({
      modal: !previous.modal
    }));
  };

  // Deletes an exercise, refreshes the list, then closes the popup.
  deleteFood = id => {
    console.log(id)
    const { apiToken } = this.props;
    const config = apiToken ? { headers: { Authorization: `Token ${apiToken}` } } : {};
    axios.delete(API_URL + id + "/", config).then(() => {
      this.props.resetState();
      this.toggle();
    });
  };

  render() {
    const theme = this.props.theme

    if (theme === 'light') {
      return (
        <Fragment>
          <Button color="danger" onClick={() => this.toggle()}>
            Remove
          </Button>
          <Modal isOpen={this.state.modal} toggle={this.toggle}>
            <ModalHeader toggle={this.toggle}>
              Do you really want to delete this exercise?
            </ModalHeader>

            <ModalFooter>
              <Button type="button" onClick={() => this.toggle()}>
                Cancel
              </Button>
              <Button
                type="button"
                color="primary"
                onClick={() => this.deleteFood(this.props.id)}
              >
                Yes
              </Button>
            </ModalFooter>
          </Modal>
        </Fragment>
      );
    } else if (theme === 'dark') {
      return (
        <Fragment>
          <Button color="danger" onClick={() => this.toggle()}>
            Remove
          </Button>
          <Modal isOpen={this.state.modal} toggle={this.toggle}>
            <ModalHeader style={{ backgroundColor: "#333", color: "whitesmoke" }} toggle={this.toggle}>
              Do you really want to delete this exercise?
            </ModalHeader>

            <ModalFooter style={{ backgroundColor: "#333", color: "whitesmoke" }}>
              <Button type="button" onClick={() => this.toggle()}>
                Cancel
              </Button>
              <Button
                type="button"
                color="primary"
                onClick={() => this.deleteFood(this.props.id)}
              >
                Yes
              </Button>
            </ModalFooter>
          </Modal>
        </Fragment>
      );
    }
  }
}

export default ConfirmRemovalModal;