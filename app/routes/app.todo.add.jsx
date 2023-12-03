import { useNavigate } from "@remix-run/react";
import Modal from "../components/Modal";
import TodoForm from "../components/CollectionForm";

export default function AddTodo() {
  const navigate = useNavigate();
  function closeHandler() {
    navigate("..");
  }

  return (
    <Modal onClose={closeHandler}>
      <TodoForm />
    </Modal>
  );
}
