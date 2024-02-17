'use server'
import { getProofId } from '@/lib/redis';
import { getSession } from '@/lib/session';
import axios from 'axios';
import { redirect } from 'next/navigation';
import { uuid } from 'uuidv4';

const API_KEY = process.env.SINDRI_API_KEY || "";
const CIRCUIT_ID = process.env.SINDRI_CIRCUIT_ID || "";
const API_URL_PREFIX = "https://sindri.app/api/";

const API_VERSION = "v1";
const API_URL = API_URL_PREFIX.concat(API_VERSION);

const headersJson = {
    Accept: "application/json",
    Authorization: `Bearer ${API_KEY}`
};

const headersForm = {
    'Content-Type': 'application/x-www-form-urlencoded',
    Accept: "application/json",
    Authorization: `Bearer ${API_KEY}`
};

export async function pollForStatus(endpoint: string, timeout = 20 * 60) {
    for (let i = 0; i < timeout; i++) {
        const response = await axios.get(API_URL + endpoint, {
            headers: headersJson,
            validateStatus: (status) => status === 200,
        });

        const status = response.data.status;
        if (["Ready", "Failed"].includes(status)) {
            console.log(`Poll exited after ${i} seconds with status: ${status}`);
            return response;
        }

        await new Promise((r) => setTimeout(r, 1000));
    }

    throw new Error(`Polling timed out after ${timeout} seconds.`);
}

async function createProof(proofInput: string) {
    const postData = new URLSearchParams();
    postData.append('proof_input', proofInput)
    const proveResponse = await axios.post(
        API_URL + `/circuit/${CIRCUIT_ID}/prove`,
        postData,
        { headers: headersForm, validateStatus: (status) => status === 201 },
      );
    return proveResponse.data.proof_id;
}

export async function getSessionToken(): Promise<string> {
    const session = await getSession();
    if (!session.token) {
        session.token = uuid();
        await session.save();
    }
    return session.token;
}

export async function signOut() {
    const session = await getSession();
    session.destroy();
    redirect('/');
}

export async function refreshSessionToken(): Promise<string> {
    const session = await getSession();
    session.token = uuid();
    await session.save();
    return session.token;
}

export async function getProofIdByToken(token: string) {
    return await getProofId(token);
}