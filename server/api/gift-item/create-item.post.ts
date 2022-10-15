import prisma from "~~/lib/prisma";
import { NewGiftItem } from "~~/lib/types";

export default defineEventHandler(async (event) => {
    const body: NewGiftItem = await useBody(event);

    return await prisma.giftItem.create({
        data: body,
    });
});
