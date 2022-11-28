import prisma from "~~/lib/prisma";
import { Group } from "~~/lib/types";

export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    const group = String(query.group) as Group;

    if (!group) throw new Error("No 'group' given");

    return await prisma.giftItem.findMany({
        where: {
            groups: {
                has: group,
            },
        },
    });
});
