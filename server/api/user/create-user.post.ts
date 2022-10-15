import prisma from "~~/lib/prisma";
import { NewUser } from "~~/lib/types";

export default defineEventHandler(async (event) => {
    const body: NewUser = await useBody(event);

    if (!body.name || !body.password || !body.groups)
        throw new Error("Not enough data");

    return await prisma.user.create({
        data: {
            ...body,

            groups: {
                connect: body.groups.map((groupId) => ({
                    id: groupId,
                })),
            },
        },
    });
});
