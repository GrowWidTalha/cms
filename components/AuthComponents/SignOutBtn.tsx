"use client";
import { signOut } from "next-auth/react";
import React from "react";
import { Button } from "../ui/button";

const SignOutBtn = () => {
    return <Button onClick={() => signOut()}>Sign Out</Button>;
};

export default SignOutBtn;
