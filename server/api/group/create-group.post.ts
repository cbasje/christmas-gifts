import prisma from "~~/lib/prisma";
import { NewGroup } from "~~/lib/types";

export default defineEventHandler(async (event) => {
    const body: NewGroup = await useBody(event);

    if (!body.name) throw new Error("Not enough data");

    return await prisma.group.create({
        data: body,
    });
});
