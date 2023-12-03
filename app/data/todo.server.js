import prisma from "../db.server";

export const generateTodo = async (todoObj) => {
  try {
    return await prisma.todo.create({ data: todoObj });
  } catch (error) {
    throw new Error(error.message);
  }
};

export const allTodo = async () => {
  try {
    return await prisma.todo.findMany();
  } catch (error) {
    throw new Error(error.message);
  }
};

export const deleteTodo = async (id) => {
  try {
    return await prisma.todo.delete({
      where: {
        id: parseInt(id), // Assuming id is a string, you may need to convert it to an integer
      },
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

export const updateTodo = async (id, data) => {
  try {
    return await prisma.todo.update({ select: { id }, data: data });
  } catch (error) {
    throw new Error(error.message);
  }
};
