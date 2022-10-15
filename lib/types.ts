import { GiftItem } from "@prisma/client";

export type NewGiftItem = Omit<GiftItem, "id" | "createdAt" | "updatedAt">;
