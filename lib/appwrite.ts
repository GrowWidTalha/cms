import { Client, Account, Databases } from 'node-appwrite';


export const DATABASE_ID = process.env.DATABASE_ID;
export const USER_COLLECTION_ID = process.env.USER_COLL_ID;
export const ADMIN_ASSIGN_COLL_ID = process.env.ADMIN_ASSIGN_COLL_ID;
export const ADMIN_ASSIGN_SUB_COLL_ID = process.env.ADMIN_ASSIGN_SUB_COLL_ID;
export const CLASS_ASSIGN_COLL_ID = process.env.CLASS_ASSIGN_COLL_ID;
export const CLASS_ASSIGN_SUB_COLL_ID = process.env.CLASS_ASSIGN_SUB_COLL_ID;
export const TEACHER_COLL_ID = process.env.TEACHER_COLL_ID;
export const SLOT_COLL_ID = process.env.SLOT_COLL_ID;
const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1') // Set your Appwrite endpoint
    .setProject(process.env.PROJECT_ID!).setKey(process.env.API_KEY!); // Set your project ID

export const account = new Account(client);
export const databases = new Databases(client);
