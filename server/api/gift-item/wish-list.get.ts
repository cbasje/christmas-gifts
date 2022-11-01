import prisma from "~~/lib/prisma";
import { Group } from "~~/lib/types";

export default defineEventHandler(async (event) => {
    const query = useQuery(event);
    const id = String(query.id);
    const group = String(query.group) as Group;

    if (!id || !group) throw new Error("Not enough data");

    return await prisma.giftItem.findMany({
        where: {
            AND: {
                recipientId: id,
                groups: {
                    has: group,
                },
            },
        },
    });
});
