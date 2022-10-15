import prisma from "~~/lib/prisma";

export default defineEventHandler(async (event) => {
    const query = useQuery(event);
    const id = String(query.id);
    const purchased = Boolean(query.id);

    return await prisma.giftItem.update({
        where: {
            id,
        },
        data: {
            purchased,
        },
        select: {
            id: true,
            purchased: true,
        },
    });
});
