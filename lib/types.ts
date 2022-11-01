import {
    GiftItem as PrismaGiftItem,
    Group as PrismaGroup,
    User as PrismaUser,
} from "@prisma/client";

export type GiftItem = PrismaGiftItem;
export type NewGiftItem = Omit<
    PrismaGiftItem,
    "id" | "createdAt" | "updatedAt"
>;
export type EditGiftItem = Omit<PrismaGiftItem, "createdAt" | "updatedAt">;

export type User = PrismaUser;
export type NewUser = Omit<PrismaUser, "id" | "createdAt" | "updatedAt"> & {
    groups: Group[];
};

export const Group: { [k in PrismaGroup]: k } = {
    BENJAMINS: "BENJAMINS",
    HAUGEN: "HAUGEN",
} as const;
export type Group = PrismaGroup;
export type NewGroup = Omit<Group, "id" | "createdAt" | "updatedAt">;

export type Color =
    | "pink"
    | "purple"
    | "indigo"
    | "sky"
    | "teal"
    | "green"
    | "yellow"
    | "orange"
    | "gray"
    | "primary";
