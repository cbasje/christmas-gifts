import prisma from "~~/lib/prisma";

export default defineEventHandler(async (event) => {
    const query = useQuery(event);
    const id = String(query.id);

    if (!id) throw new Error("No 'id' given");

    return await prisma.user.findFirst({
        where: {
            id,
        },
    });
});
