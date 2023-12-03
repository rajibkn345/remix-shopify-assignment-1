import {
  Box,
  Card,
  Layout,
  Link,
  List,
  Grid,
  Page,
  Text,
  BlockStack,
  FormLayout,
  TextField,
  IndexTable,
  Icon,
  Badge,
  Button,
  Divider,
} from "@shopify/polaris";
import { Form } from "@remix-run/react";

function TodoForm({ onClose }) {
  return (
    <Card>
      <BlockStack gap="200">
        <Form method="POST">
          <div style={{ marginBottom: "10px" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <label htmlFor="title">Title</label>
              <input type="text" name="title" />
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <label htmlFor="description">Description</label>
              <input type="text" name="description" />
            </div>
          </div>

          <Button
            onClick={() => {
              setTimeout(() => {
                onClose();
              }, 300);
            }}
            submit
          >
            Submit
          </Button>
        </Form>
      </BlockStack>
    </Card>
  );
}

export default TodoForm;
