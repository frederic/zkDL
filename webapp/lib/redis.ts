'use server'
import { kv } from '@vercel/kv';

export async function getProofId(token: string): Promise<string> {
    return await kv.get(`token:${token}`) || "";
}

export async function setProofId(token: string, proofId: string) {
    await kv.set(`token:${token}`, proofId, { ex: 3600 });
}