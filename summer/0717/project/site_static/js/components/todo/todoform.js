import React from "react";
import "antd/dist/antd.css";
import { Modal } from "antd";
import EditForm from "./editform";

class EditModal extends React.Component {
  state = {};
  showModal = () => {this.setState({ visible: true });};
  handleCancel = () => {this.setState({ visible: false });};

  render() {
    const { visible, confirmLoading } = this.state;
    return (
      <>
        <span onClick={this.showModal}>{this.props.title}</span>
        <Modal
          title="Edit Todo Item" visible={visible}
          confirmLoading={confirmLoading} onCancel={this.handleCancel}
          footer={[null]}
        >
          <EditForm />
        </Modal>
      </>
    );
  }
}

export default EditModal;
