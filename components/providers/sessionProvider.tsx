import { auth } from "@/auth";
import { SessionProvider as Provider } from "next-auth/react";
import React from "react";

const SessionProvider = async ({ children }: { children: React.ReactNode }) => {
    const session = await auth();
    return <Provider session={session}>{children}</Provider>;
};

export default SessionProvider;
