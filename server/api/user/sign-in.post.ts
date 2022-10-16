import { User } from "@prisma/client";
import prisma from "~~/lib/prisma";

export default defineEventHandler(async (event) => {
    const body: Pick<User, "password"> = await useBody(event);

    if (!body.password) throw new Error("Not enough data");

    return await prisma.user.findFirst({
        where: {
            password: body.password,
        },
        select: {
            id: true,
            groups: true,
        },
    });
});
