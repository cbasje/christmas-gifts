import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const users = [
    { name: "Amani", password: "amani12", groups: ["HAUGEN"] },
    { name: "Boudewijn", password: "boudewijn12", groups: ["BENJAMINS"] },
    { name: "Charis", password: "charis23", groups: ["HAUGEN"] },
    { name: "George", password: "george34", groups: ["HAUGEN"] },
    { name: "Ingrid", password: "ingrid34", groups: ["BENJAMINS"] },
    { name: "Jeanne", password: "jeanne45", groups: ["HAUGEN"] },
    { name: "Mika", password: "mika56", groups: ["HAUGEN", "BENJAMINS"] },
    { name: "Pien", password: "pien34", groups: ["BENJAMINS"] },
    {
        name: "Sebastiaan",
        password: "sebas67",
        groups: ["HAUGEN", "BENJAMINS"],
    },
    { name: "Simon", password: "simon23", groups: ["BENJAMINS"] },
    { name: "Tori", password: "tori78", groups: ["HAUGEN"] },
    { name: "Will", password: "will89", groups: ["HAUGEN"] },
];

async function main() {
    const createdUsers = await Promise.all(
        users.map(
            async (u) =>
                await prisma.user.upsert({
                    where: { name: u.name },
                    create: {
                        name: u.name,
                        password: u.password,
                        groups: u.groups,
                    },
                    update: { password: u.password, groups: u.groups },
                })
        )
    );

    console.log({ createdUsers });
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
