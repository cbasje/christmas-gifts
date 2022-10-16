import prisma from "~~/lib/prisma";
import { NewUser } from "~~/lib/types";

export default defineEventHandler(async (event) => {
    const body: NewUser = await useBody(event);

    if (!body.name || !body.password || !body.groups)
        throw new Error("Not enough data");

    return await prisma.user.upsert({
        create: body,
        update: body,
        where: {
            name: body.name,
        },
    });
});
