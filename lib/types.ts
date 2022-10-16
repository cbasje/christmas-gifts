import { GiftItem, Group, User } from "@prisma/client";

export type NewGiftItem = Omit<GiftItem, "id" | "createdAt" | "updatedAt"> & {
    groups: Group[];
};
export type NewUser = Omit<User, "id" | "createdAt" | "updatedAt"> & {
    groups: Group[];
};
export type NewGroup = Omit<Group, "id" | "createdAt" | "updatedAt">;
