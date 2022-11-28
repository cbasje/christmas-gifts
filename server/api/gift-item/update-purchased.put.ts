import prisma from "~~/lib/prisma";

export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    const id = String(query.id);
    const purchased = String(query.purchased);

    const giftedById = getCookie(event, "user");

    if (!id || !purchased) throw new Error("Not enough data");

    return await prisma.giftItem.update({
        where: {
            id,
        },
        data: {
            purchased: purchased === "true",
            giftedById,
        },
        select: {
            id: true,
            purchased: true,
        },
    });
});
