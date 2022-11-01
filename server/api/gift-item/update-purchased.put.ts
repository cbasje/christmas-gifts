import prisma from "~~/lib/prisma";

export default defineEventHandler(async (event) => {
    const query = useQuery(event);
    const id = String(query.id);
    const purchased = String(query.purchased);

    if (!id || !purchased) throw new Error("Not enough data");

    return await prisma.giftItem.update({
        where: {
            id,
        },
        data: {
            purchased: purchased === "true",
        },
        select: {
            id: true,
            purchased: true,
        },
    });
});
