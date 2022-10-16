import prisma from "~~/lib/prisma";
import { EditGiftItem } from "~~/lib/types";

export default defineEventHandler(async (event) => {
    const body: EditGiftItem = await useBody(event);

    return await prisma.giftItem.update({
        where: {
            id: body.id,
        },
        data: body,
    });
});
