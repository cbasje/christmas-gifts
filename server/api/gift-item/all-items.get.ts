import prisma from "~~/lib/prisma";
import { Group } from "~~/lib/types";

export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    const group = String(query.group) as Group;

    const userId = getCookie(event, "user");

    if (!userId || !group) throw new Error("Not enough data");

    return await prisma.giftItem.findMany({
        where: {
            AND: {
                NOT: {
                    recipientId: userId,
                },
                groups: {
                    has: group,
                },
            },
        },
    });
});
