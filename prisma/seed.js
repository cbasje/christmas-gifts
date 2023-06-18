import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const users = [
    { name: "Amani", password: "amani12", groups: ["HAUGEN"] },
    { name: "Boudewijn", password: "boudewijn12", groups: ["BENJAMINS"] },
    {
        name: "Charis",
        password: "charis23",
        groups: ["HAUGEN"],
        partner: "Amani",
    },
    { name: "George", password: "george34", groups: ["HAUGEN"] },
    { name: "Ingrid", password: "ingrid34", groups: ["BENJAMINS"] },
    {
        name: "Jeanne",
        password: "jeanne45",
        groups: ["HAUGEN"],
        partner: "George",
    },
    { name: "Mika", password: "mika56", groups: ["HAUGEN", "BENJAMINS"] },
    {
        name: "Pien",
        password: "pien34",
        groups: ["BENJAMINS"],
        partner: "Boudewijn",
    },
    {
        name: "Sebastiaan",
        password: "sebas67",
        groups: ["HAUGEN", "BENJAMINS"],
        partner: "Mika",
    },
    {
        name: "Simon",
        password: "simon23",
        groups: ["BENJAMINS"],
        partner: "Ingrid",
    },
    { name: "Tori", password: "tori78", groups: ["HAUGEN"] },
    { name: "Will", password: "will89", groups: ["HAUGEN"] },
];

async function main() {
    for await (const u of users) {
        await prisma.user.upsert({
            where: { name: u.name },
            create: {
                name: u.name,
                password: u.password,
                groups: u.groups,
                partner: u.partner
                    ? {
                          connectOrCreate: {
                              where: {
                                  name: u.partner,
                              },
                              create: {
                                  name: u.partner,
                                  password: "",
                              },
                          },
                      }
                    : undefined,
            },
            update: { password: u.password, groups: u.groups },
        });
    }
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
