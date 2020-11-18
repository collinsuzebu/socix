import React, { useState } from "react";
import mime from "mime-types";
import { Button, Icon, Input, Modal } from "semantic-ui-react";

export function FileModal({ modal, closeModal, uploadFile }) {
  const [file, setFile] = useState(null);
  const [allowedFiles, _] = useState(["image/jpeg", "image/png"]);

  const addFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
    }
  };

  const sendFile = () => {
    if (file !== null) {
      if (isAllowedFileType(file.name)) {
        const metadata = { contentType: mime.lookup(file.name) };
        uploadFile(file, metadata);
        closeModal();
        clearFile();
      }
    }
  };

  const clearFile = () => setFile(null);

  const isAllowedFileType = (filename) =>
    allowedFiles.includes(mime.lookup(filename));
  return (
    <Modal basic open={modal} onClose={closeModal}>
      <Modal.Header>Select a file</Modal.Header>
      <Modal.Content>
        <Input onChange={addFile} fluid label="Files" name="file" type="file" />
      </Modal.Content>
      <Modal.Actions>
        <Button color="green" inverted onClick={sendFile}>
          <Icon name="checkmark" /> Send
        </Button>
        <Button color="red" inverted onClick={closeModal}>
          <Icon name="remove" /> Cancel
        </Button>
      </Modal.Actions>
    </Modal>
  );
}
