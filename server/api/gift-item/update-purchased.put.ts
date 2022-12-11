import prisma from "~~/lib/prisma";

export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    const id = String(query.id);
    const purchased = String(query.purchased);
    const isIdea = String(query.isIdea);

    const giftedById = getCookie(event, "user");

    if (!id || !purchased) throw new Error("Not enough data");

    return await prisma.giftItem.update({
        where: {
            id,
        },
        data: {
            purchased: purchased === "true",
            giftedBy:
                purchased === "true" || isIdea === "true"
                    ? {
                          connect: {
                              id: giftedById,
                          },
                      }
                    : {
                          disconnect: true,
                      },
            ideaLink: {
                update: {
                    purchased: purchased === "true",
                },
            },
        },
        select: {
            id: true,
            purchased: true,
            giftedById: true,
        },
    });
});
