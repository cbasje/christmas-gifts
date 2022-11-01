import prisma from "~~/lib/prisma";
import { Group } from "~~/lib/types";

export default defineEventHandler(async (event) => {
    const query = useQuery(event);
    const group = String(query.group) as Group;

    if (!group) throw new Error("No 'group' given");

    return await prisma.user.findMany({
        include: {
            items: {
                select: { id: true },
            },
        },
        where: {
            groups: {
                has: group,
            },
        },
    });
});
