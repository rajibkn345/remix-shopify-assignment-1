import { Card, Tabs } from "@shopify/polaris";
import FaqGroup from "../components/FaqGroup";
import { allFaq } from "../data/faq.server";
import { useParams, useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import sharedStyles from "../styles/shared.css";
import expenseStyles from "../styles/expense.css";
import polarisStyles from "@shopify/polaris/build/esm/styles.css";

export const links = () => [
  { rel: "stylesheet", href: polarisStyles },
  { rel: "stylesheet", href: sharedStyles },
  { rel: "stylesheet", href: expenseStyles },
];
const FaqSingleGroup = () => {
  const [filterItem, setFilterItem] = useState([]);
  const { faqs } = useLoaderData();

  const params = useParams();
  useEffect(() => {
    const items = faqs.filter((item) => item.group === params.group);
    setFilterItem(items);
  }, []);
  return (
    <div style={{ padding: "20px" }}>
      <Card>
        <FaqGroup items={filterItem} />
      </Card>
    </div>
  );
};

export default FaqSingleGroup;

export async function loader() {
  let faqs = await allFaq();
  return { faqs };
}
