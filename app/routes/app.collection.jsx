import React from "react";
import {
  Button,
  Text,
  Card,
  Frame,
  Modal,
  TextContainer,
} from "@shopify/polaris";
import modalStyle from "../styles/modal.css";
import { useState, useCallback, useRef } from "react";
import { Link } from "@remix-run/react";
import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import { Form, useLoaderData } from "@remix-run/react";
import CollectionForm from "../components/CollectionForm";

function collection() {
  const [active, setActive] = useState(false);

  const button = useRef();

  const handleOpen = useCallback(() => setActive(true), []);

  const handleClose = useCallback(() => {
    setActive(false);
    requestAnimationFrame(() =>
      button.current?.querySelector("button")?.focus()
    );
  }, []);
  const { collection } = useLoaderData();

  const itemCollections = collection.map((collection) => {
    const { id, title, description } = collection.node;
    return { id, title, description };
  });

  console.log({ itemCollections });
  return (
    <Card>
      <Text as="h2" alignment="center" variant="headingLg">
        Collections
      </Text>
      <div ref={button}>
        <Link onClick={handleOpen}>Add Collection</Link>
      </div>
      <div>
        <Modal
          instant
          open={active}
          onClose={handleClose}
          title="Add Collections"
        >
          <Modal.Section>
            <CollectionForm onClose={handleClose} />
          </Modal.Section>
        </Modal>
      </div>
      <Card>
        <table>
          <thead>
            <tr style={{ textAlign: "left", border: "1px solid grey" }}>
              <th>Name</th>
              <th>Description</th>
              <th style={{ textAlign: "center" }}>Action</th>
            </tr>
          </thead>

          <tbody>
            {itemCollections.map((item) => (
              <>
                <tr
                  key={item.id}
                  style={{ textAlign: "left", border: "1px solid #777" }}
                >
                  <td>{item.title}</td>
                  <td>{item.description}</td>
                  <td
                    style={{
                      textAlign: "center",
                      display: "flex",
                      justifyContent: "space-around",
                      width: "120px",
                    }}
                  >
                    <Button tone="success">edit</Button>
                    <Form method="DELETE">
                      <input
                        type="text"
                        hidden={true}
                        name="id"
                        defaultValue={item.id}
                      />
                      <Button submit tone="critical">
                        delete
                      </Button>
                    </Form>
                  </td>
                </tr>
              </>
            ))}
          </tbody>
        </table>
      </Card>
    </Card>
  );
}

export default collection;

export async function loader({ request }) {
  const { admin } = await authenticate.admin(request);

  const response = await admin.graphql(
    `#graphql
      query {
        collections(first: 5) {
          edges {
            node {
              id
              title
              description
              handle
              updatedAt
              productsCount
              sortOrder
            }
          }
        }
      }`
  );

  const data = await response.json();

  const collection = data.data.collections.edges;
  return { collection };
}

export const links = () => [{ rel: "stylesheet", href: modalStyle }];

export async function action({ request }) {
  const { admin } = await authenticate.admin(request);
  if (request.method === "POST") {
    const formData = await request.formData();
    const inputData = Object.fromEntries(formData);
    //   console.log("in======", inputData);

    const response = await admin.graphql(
      `#graphql
        mutation CollectionCreate($input: CollectionInput!) {
          collectionCreate(input: $input) {
            userErrors {
              field
              message
            }
            collection {
              id
              title
              descriptionHtml
              handle
              sortOrder
              ruleSet {
                appliedDisjunctively
                rules {
                  column
                  relation
                  condition
                }
              }
            }
          }
        }`,
      {
        variables: {
          input: {
            title: inputData.title,
            descriptionHtml: inputData.description,
            ruleSet: {
              appliedDisjunctively: false,
              rules: {
                column: "TITLE",
                relation: "CONTAINS",
                condition: "shoe",
              },
            },
          },
        },
      }
    );

    const data = await response.json();
    console.log("data=======", data);
    return null;
  } else if (request.method === "DELETE") {
    const formData = await request.formData();
    const delData = Object.fromEntries(formData);
    console.log(delData, "dell===");
    const response = await admin.graphql(
      `#graphql
        mutation collectionDelete($input: CollectionDeleteInput!) {
          collectionDelete(input: $input) {
            deletedCollectionId
            shop {
              id
              name
            }
            userErrors {
              field
              message
            }
          }
        }`,
      {
        variables: {
          input: {
            id: delData.id,
          },
        },
      }
    );
    const data = await response.json();
    return { data };
  }
}
