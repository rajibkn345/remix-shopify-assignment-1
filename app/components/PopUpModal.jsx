import React, { useState } from "react";
import { Modal, Button } from "@shopify/polaris";

const PopUpModal = ({ title, children, onPrimaryAction, setShowModal }) => {
  const handlePrimaryAction = () => {
    onPrimaryAction();
    setShowModal(false);
  };

  return (
    <div>
      <Modal
        open={true}
        onClose={() => setShowModal(false)}
        title={title || ""}
        primaryAction={{
          content: "Save",
          onAction: handlePrimaryAction,
        }}
        secondaryActions={[
          {
            content: "Cancel",
            onAction: () => setShowModal(false),
          },
        ]}
      >
        <Modal.Section>{children}</Modal.Section>
      </Modal>
    </div>
  );
};

export default PopUpModal;
