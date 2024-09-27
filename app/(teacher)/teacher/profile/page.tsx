import { getTeacherById } from "@/actions/teacher.actions";
import { auth } from "@/auth";
import TeacherProfile from "@/components/TeacherComponents/EditProfileForm";
import React from "react";

const ProfilePage = async () => {
    const session = await auth();
    const teacher = await getTeacherById(session?.user.id);
    if (!teacher) {
        return <p>Teacher not found</p>;
    }
    return (
        <div className="flex items-center justify-center w-full h-screen overflow-hidden">
            <TeacherProfile teacherData={teacher} />
        </div>
    );
};

export default ProfilePage;
