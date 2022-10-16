import prisma from "~~/lib/prisma";
import { NewGiftItem } from "~~/lib/types";

export default defineEventHandler(async (event) => {
    const body: NewGiftItem = await useBody(event);

    if (!body.name || !body.groups) throw new Error("Not enough data");

    return await prisma.giftItem.create({
        data: body,
    });
});
