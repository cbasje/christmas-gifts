import prisma from "~~/lib/prisma";
import { Group } from "~~/lib/types";

export default defineEventHandler(async (event) => {
    const query = useQuery(event);
    const group = String(query.group) as Group;

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
