import prisma from "~~/lib/prisma";

export default defineEventHandler(async (event) => {
    return await prisma.user.findMany({
        select: {
            id: true,
            name: true,
            partnerId: true,
            groups: true,
            items: {
                select: { id: true },
            },
        },
    });
});
