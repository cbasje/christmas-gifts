import { getServerSession } from "#auth";
import type { EventHandler } from "h3";
import { MySession } from "~/lib/types";

export const defineAuthResponseHandler = (handler: EventHandler) =>
    defineEventHandler(async (event) => {
        try {
            const session = await getServerSession(event);
            if (!(session as MySession)?.user?.id)
                throw new Error("Not authenticated");

            const response = await handler(event);

            return response;
        } catch (err) {
            // Error handling
            setResponseStatus(event, 401);
            return { err };
        }
    });
