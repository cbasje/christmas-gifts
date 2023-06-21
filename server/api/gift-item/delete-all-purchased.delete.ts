import { defineAuthResponseHandler } from "~/server/utils/handler";
import prisma from "~~/lib/prisma";

export default defineAuthResponseHandler(async () => {
    return await prisma.giftItem.deleteMany({
        where: {
            purchased: true,
        },
    });
});
