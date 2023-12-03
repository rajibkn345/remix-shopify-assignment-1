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
import { DeleteMajor, EditMajor } from "@shopify/polaris-icons";
import { allTodo, deleteTodo, generateTodo } from "../data/todo.server";
import { useLoaderData } from "@remix-run/react";
import { redirect } from "@remix-run/node";
import { useState } from "react";

export default function TodoPage() {
  const todo = useLoaderData();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [addState, setAddState] = useState("POST");

  const updateHandler = (item) => {
    setTitle(item.title);
    setDescription(item.description);
    setAddState("PUT");
  };

  console.log({ todo });
  return (
    <Page>
      <ui-title-bar title="Additional page" />
      <Layout>
        <Layout.Section>
          
        </Layout.Section>
        <Layout.Section>
          <Card>
            <BlockStack gap="300">
              <Text as="h2" variant="headingMd">
                Todo List
              </Text>

              <IndexTable
                itemCount={todo.length}
                headings={[
                  { title: "SL" },
                  { title: "Title" },
                  { title: "Description" },
                  { title: "Action", alignment: "center" },
                ]}
                selectable={false}
              >
                {todo.map((item, i) => (
                  <IndexTable.Row key={item.id} position={i}>
                    <IndexTable.Cell>
                      <Text variant="bodyMd" fontWeight="bold" as="span">
                        {i + 1}
                      </Text>
                    </IndexTable.Cell>
                    <IndexTable.Cell>{item.title}</IndexTable.Cell>
                    <IndexTable.Cell>{item.description}</IndexTable.Cell>
                    <IndexTable.Cell>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-evenly",
                        }}
                      >
                        <Button tone="primary">
                          <Icon source={EditMajor} tone="primary" />
                        </Button>

                        <Form method="DELETE">
                          <input type="hidden" name="id" value={item.id} />
                          <Button submit tone="critical">
                            <Icon source={DeleteMajor} tone="critical" />
                          </Button>
                        </Form>
                      </div>
                    </IndexTable.Cell>
                  </IndexTable.Row>
                ))}
              </IndexTable>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

export async function action({ request }) {
  console.log("hii===", request);
  if (request.method === "POST") {
    //create method
    const body = await request.formData();

    const description = body.get("description");
    const title = body.get("title");

    if (title === "" || description === "") {
      console.log("Fields must not empty");
      return null;
    } else {
      return await generateTodo({ title, description });
    }
  } else if (request.method === "PUT") {
    //update method
    console.log("PUT===");
    const body = await request.formData();

    const description = body.get("description");
    const title = body.get("title");
    if (title === "" || description === "") {
      console.log("Fields must not empty");
      return null;
    } else {
      return await updateTodo(id, { title, description });
    }
  } else if (request.method === "DELETE") {
    //Delete method
    const body = await request.formData();
    const itemId = body.get("id");
    console.log("delete====", itemId);
    const res = await deleteTodo(itemId);
    if (res.length !== 0) {
      return redirect(request.url);
    } else {
      return null;
    }
  }
}

export async function loader() {
  return await allTodo();
}
