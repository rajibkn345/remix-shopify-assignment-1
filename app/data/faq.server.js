import prisma from "../db.server";

export const generateFAQ = async (todoObj) => {
  try {
    return await prisma.faq.create({ data: todoObj });
  } catch (error) {
    throw new Error(error.message);
  }
};

export const allFaq = async () => {
  try {
    return await prisma.faq.findMany();
  } catch (error) {
    throw new Error(error.message);
  }
};

export const deleteFaq = async (id) => {
  try {
    return await prisma.faq.delete({
      where: {
        id: parseInt(id), // Assuming id is a string, you may need to convert it to an integer
      },
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

export const updateFaq = async (id, data) => {
  try {
    return await prisma.faq.update({
      where: { id: +id },
      data: data,
    });
  } catch (error) {
    throw new Error(error.message);
  }
};
