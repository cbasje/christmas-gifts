import prisma from "~~/lib/prisma";
import { EditGiftItem } from "~~/lib/types";

export default defineEventHandler(async (event) => {
    const body: EditGiftItem = await useBody(event);

    if (!body.name || !body.groups) throw new Error("Not enough data");

    return await prisma.giftItem.update({
        where: {
            id: body.id,
        },
        data: body,
    });
});
