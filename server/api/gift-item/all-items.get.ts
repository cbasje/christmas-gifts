import { getServerSession } from "#auth";
import prisma from "~~/lib/prisma";
import { Group } from "~~/lib/types";

export default defineEventHandler(async (event) => {
    const session = await getServerSession(event);
    const query = getQuery(event);

    const userId = session?.uid;
    const group = String(query.group) as Group;

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
