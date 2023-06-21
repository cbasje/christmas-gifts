import { defineAuthResponseHandler } from "~/server/utils/handler";
import prisma from "~~/lib/prisma";

export default defineAuthResponseHandler(async () => {
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
