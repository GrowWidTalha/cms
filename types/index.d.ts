export interface CreateAssignmentProps {
    title: string;
    description: string;
    resources: string[];
    milestones: string[];
    startDate: Date;
    endDate: Date;
    isEvaluated: boolean;
    isPublished: boolean;
    type: "assignment" | "hackathon";
}

export interface CreateTeacherProps {
    name: string;
    email: string;
    password: string;
    slot: string;
}


export interface CreateClassAssignmentProps {
    title: string;
    description: string;
    resources: string[];
    teacher: string;
    classSlot: string;
    isPublished: boolean;
}

export interface UpdateClassAssignmentProps {
    title: string;
    description: string;
    resources: string[];
    teacher: string;
    classSlot: string;
    isPublished: boolean;
}
