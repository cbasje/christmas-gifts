import prisma from "~~/lib/prisma";
import { Group } from "~~/lib/types";

export default defineEventHandler(async (event) => {
    const query = useQuery(event);
    const id = String(query.id);
    const group = String(query.purchased) as Group;

    return await prisma.giftItem.findMany({
        include: {
            recipient: true,
        },
        where: {
            AND: {
                NOT: {
                    recipientId: id,
                },
                groups: {
                    has: group,
                },
            },
        },
    });
});
