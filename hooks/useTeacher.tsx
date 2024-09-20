"use client";

export const useTeacher = (): { teacher: string; slot: string } | null => {
    if (typeof window === "undefined") {
        return null;
    }
    const data = localStorage.getItem("teacherAuthenticated");
    if (!data) {
        return null;
    }
    const teacher = JSON.parse(data);
    return { teacher: teacher.$id, slot: teacher.slots.$id };
};
