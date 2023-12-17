import React from "react";
import {
  Button,
  Text,
  Card,
  Select,
  FormLayout,
  TextField,
  Divider,
  Tabs,
  AppProvider,
} from "@shopify/polaris";
import { useState, useCallback, useRef } from "react";
import { Form, useLoaderData, useSubmit, Link } from "@remix-run/react";
import PopUpModal from "../components/PopUpModal";
import { allFaq, deleteFaq, generateFAQ, updateFaq } from "../data/faq.server";
import sharedStyles from "../styles/shared.css";
import expenseStyles from "../styles/expense.css";
import polarisStyles from "@shopify/polaris/build/esm/styles.css";

export const links = () => [
  { rel: "stylesheet", href: polarisStyles },
  { rel: "stylesheet", href: sharedStyles },
  { rel: "stylesheet", href: expenseStyles },
];

function Faq() {
  const { faqs } = useLoaderData();

  const submit = useSubmit();
  const [id, setId] = useState(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [selected, setSelected] = useState("a");

  const [showModal, setShowModal] = useState(false);

  const options = [
    { label: "A", value: "a" },
    { label: "B", value: "b" },
    { label: "C", value: "c" },
  ];

  const handleSelectChange = useCallback((value) => setSelected(value), []);
  return (
    <AppProvider>
      <div style={{ padding: "20px 10px" }}>
        <div className="navbar">
          <div className="flex-1">
            <Link to={"/faq"} className="btn btn-ghost text-xl">
              Faq
            </Link>
          </div>
          <div className="flex-none">
            <ul className="menu menu-horizontal px-1">
              <li>
                <Link to={"a"}>Group A</Link>
              </li>
              <li>
                <Link to={"b"}>Group B</Link>
              </li>
              <li>
                <Link to={"c"}>Group C</Link>
              </li>
            </ul>
          </div>
        </div>
        <div style={{ margin: "20px 10px" }}>
          <Button
            onClick={() => {
              setShowModal(true);
              setId(null);
            }}
            tone="success"
          >
            Add FAQ
          </Button>
        </div>
      </div>
      <Card>
        <div>
          {showModal && (
            <PopUpModal
              title={id ? "Edit FAQ" : "Create FAQ"}
              setShowModal={setShowModal}
              onPrimaryAction={() => {
                submit(
                  {
                    id,
                    question,
                    answer,
                    group: selected,
                  },
                  { replace: true, method: "POST" }
                );
              }}
            >
              <FormLayout>
                <TextField
                  label="Question"
                  type="text"
                  value={question}
                  autoComplete="off"
                  onChange={setQuestion}
                />
                <TextField
                  label="Answer"
                  type="text"
                  value={answer}
                  autoComplete="off"
                  onChange={setAnswer}
                />
                <Select
                  label="Group"
                  options={options}
                  onChange={handleSelectChange}
                  value={selected}
                />
              </FormLayout>
            </PopUpModal>
          )}
        </div>
        <Card>
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Question</th>
                  <th>Answer</th>
                  <th>Group</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {faqs?.map((item) => (
                  <tr key={item.id} style={{ border: 0 }}>
                    <td>{item.question}</td>
                    <td>{item.answer}</td>
                    <td>{item.group}</td>
                    <td style={{ display: "flex", gap: "10px" }}>
                      <Button
                        onClick={() => {
                          setId(item.id);
                          setQuestion(item.question);
                          setAnswer(item.answer);
                          setSelected(item.group);
                          setShowModal(true);
                        }}
                        tone="success"
                      >
                        edit
                      </Button>

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
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </Card>
    </AppProvider>
  );
}

export default Faq;

export async function loader() {
  let faqs = await allFaq();
  return { faqs };
}

export async function action({ request }) {
  console.log("method=======", request.method);
  if (request.method === "POST") {
    const formData = await request.formData();
    const inputData = Object.fromEntries(formData);
    console.log("in======", inputData);
    const { id, question, answer, group } = inputData;

    if (id == "null") {
      const res = await generateFAQ({ question, answer, group });
      console.log("r====", res);
      return null;
    } else {
      const res = await updateFaq(+id, { question, answer, group });
      console.log(res, "u===");
      return null;
    }
  } else if (request.method === "DELETE") {
    const formData = await request.formData();
    const { id } = Object.fromEntries(formData);
    console.log(id, "dell===");
    await deleteFaq(+id);
    return null;
  }
}
