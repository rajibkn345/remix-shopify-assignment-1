import React from "react";
import { Box, Card, Divider, Text } from "@shopify/polaris";
import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import { useLoaderData } from "@remix-run/react";
import shopify from "../shopify.server";
import GoogleFont from "react-google-fonts";

export const loader = async ({ request }) => {
  const { admin } = await authenticate.admin(request);

  const response = await admin.graphql(
    `#graphql
      query {
        shop {
          name
         id
         }
      }`
  );

  const data = await response.json();

  console.log("res==", data);
  return data;
};

function shop() {
  const { data } = useLoaderData();
  console.log("d==", data);
  return (
    <div>
        <Card>
          <Box>
            <Text variant="headingSm" as="span">
              Shop Name:{" "}
            </Text>
            <Text as="span">{data.shop.name}</Text>
          </Box>
          <Divider />
          <Box>
            <Text variant="headingSm" as="span">
              Shop Id:{" "}
            </Text>
            <Text as="span">{data.shop.id}</Text>
          </Box>
        </Card>
    </div>
  );
}

export default shop;
