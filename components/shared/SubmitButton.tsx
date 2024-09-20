import React from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const SubmitButton = ({
    children,
    className,
    isLoading,
}: {
    children: React.ReactNode;
    className?: string;
    isLoading?: boolean;
}) => {
    return (
        <Button
            className={cn("w-full", className)}
            type="submit"
            disabled={isLoading}
        >
            {isLoading ? <Loader2 className="animate-spin" /> : children}
        </Button>
    );
};

export default SubmitButton;
