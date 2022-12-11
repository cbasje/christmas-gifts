import prisma from "~~/lib/prisma";
import { Group } from "~~/lib/types";

export default defineEventHandler(async (event) => {
    const userId = getCookie(event, "user");

    if (!userId) throw new Error("Not enough data");

    return await prisma.giftItem.findMany({
        where: {
            NOT: {
                recipientId: userId,
            },
        },
    });
});
