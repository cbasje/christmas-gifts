import { defineAuthResponseHandler } from "~/server/utils/handler";
import prisma from "~~/lib/prisma";
import { User } from "~~/lib/types";

export default defineAuthResponseHandler(async (event) => {
    const body: Pick<User, "password"> = await readBody(event);

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
