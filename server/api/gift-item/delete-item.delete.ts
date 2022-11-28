import prisma from "~~/lib/prisma";

export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    const id = String(query.id);

    if (!id) throw new Error("No 'id' given");

    return await prisma.giftItem.delete({
        where: {
            id,
        },
        select: {
            id: true,
        },
    });
});
