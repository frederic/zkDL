'use server'
import { SessionOptions, getIronSession } from 'iron-session';
import { cookies } from 'next/headers';

export interface SessionData {
    token: string;
    proof_id: string
}

const sessionOptions: SessionOptions = {
    password: process.env.SECRET_COOKIE_PASSWORD as string,
    cookieName: "zkDLSession",
    cookieOptions: {
        secure: process.env.NODE_ENV === "production",
    },
};

export async function getSession() {
    return await getIronSession<SessionData>(cookies(), sessionOptions);
}