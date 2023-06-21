import { defineAuthResponseHandler } from "~/server/utils/handler";
import prisma from "~~/lib/prisma";
import { NewGiftItem } from "~~/lib/types";

export default defineAuthResponseHandler(async (event) => {
    const body: NewGiftItem = await readBody(event);

    if (!body.name || !body.groups) throw new Error("Not enough data");

    return await prisma.giftItem.create({
        data: {
            name: body.name,
            price: body.price,
            notes: body.notes,
            link: body.link,
            purchased: body.purchased,
            idea: body.idea,
            groups: body.groups,

            recipient: {
                connect: {
                    id: body.recipientId,
                },
            },
            giftedBy: body.giftedById
                ? {
                      connect: {
                          id: body.giftedById,
                      },
                  }
                : undefined,
            ideaLink: body.ideaLinkId
                ? {
                      connect: {
                          id: body.ideaLinkId,
                      },
                  }
                : undefined,
            ideaLink2: body.ideaLinkId
                ? {
                      connect: {
                          id: body.ideaLinkId,
                      },
                  }
                : undefined,
        },
    });
});
