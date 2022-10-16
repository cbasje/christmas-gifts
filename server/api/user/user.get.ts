import prisma from "~~/lib/prisma";

export default defineEventHandler(async (event) => {
    const query = useQuery(event);
    const id = String(query.id);

    return await prisma.user.findFirst({
        where: {
            id,
        },
    });
});
