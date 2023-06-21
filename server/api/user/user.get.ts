import { defineAuthResponseHandler } from "~/server/utils/handler";
import prisma from "~~/lib/prisma";

export default defineAuthResponseHandler(async (event) => {
    const query = getQuery(event);
    const id = String(query.id);

    if (!id) throw new Error("No 'id' given");

    return await prisma.user.findFirst({
        where: {
            id,
        },
    });
});
