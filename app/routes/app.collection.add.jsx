import { Card, Modal, Frame } from "@shopify/polaris";
import { useState, useCallback } from "react";
import { useNavigate } from "@remix-run/react";
import CollectionForm from "../components/CollectionForm";
import { authenticate } from "../shopify.server";

export default function addCollection() {
  const [active, setActive] = useState(true);

  const toggleModal = useCallback(() => setActive((active) => !active), []);

  const activator = <Button onClick={toggleModal}>Open</Button>;
  //   const navigate = useNavigate();

  //   function closeHandler() {
  //     // navigate programmatically
  //     navigate("..");
  //   }

  return (
    <div style={{ height: "500px" }}>
      <Frame>
        <Modal
          activator={activator}
          open={active}
          onClose={toggleModal}
          title="Get a shareable link"
          primaryAction={{
            content: "Close",
            onAction: toggleModal,
          }}
        >
          <Modal.Section>hello world</Modal.Section>
        </Modal>
      </Frame>
    </div>
  );
}

export async function loader({ request }) {
  await authenticate.admin(request);
  return null;
}

export async function action({ request }) {
  //create method
  const body = await request.formData();

  const description = body.get("description");
  const title = body.get("title");

  if (title === "" || description === "") {
    console.log("Fields must not empty");
    return null;
  } else {
    console.log("td==", title, description);
    return null;
  }
}
