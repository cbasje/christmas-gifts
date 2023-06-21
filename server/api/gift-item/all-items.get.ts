import { getServerSession } from "#auth";
import { defineAuthResponseHandler } from "~/server/utils/handler";
import prisma from "~~/lib/prisma";
import { Group, MySession } from "~~/lib/types";

export default defineAuthResponseHandler(async (event) => {
    const session = await getServerSession(event);
    const query = getQuery(event);

    const userId = (session as MySession)?.user.id;
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
