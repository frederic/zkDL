'use server'
import { getProofId } from '@/lib/redis';
import { getSession } from '@/lib/session';
import axios from 'axios';
import { redirect } from 'next/navigation';
import { uuid } from 'uuidv4';
import TOML from '@iarna/toml';

const API_KEY = process.env.SINDRI_API_KEY || "";
const API_URL_PREFIX = "https://sindri.app/api/";

const API_VERSION = "v1";
const API_URL = API_URL_PREFIX.concat(API_VERSION);

const headersJson = {
    Accept: "application/json",
    Authorization: `Bearer ${API_KEY}`
};

export async function getSessionToken(): Promise<string> {
    const session = await getSession();
    if (!session.token) {
        session.token = uuid();
        session.proof_id = '';
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
    session.proof_id = '';
    await session.save();
    return session.token;
}

export async function saveProofIdInSession(token: string) {
    const proofId = await getProofId(token);
    if (proofId) {
        const session = await getSession();
        session.proof_id = proofId;
        await session.save();
        return true;
    }
    return false;
}

async function getProofDetails(proofId: string) {//TODO move to lib
    if (!proofId) {
        return null;
    }
    const url = API_URL + '/proof/' + proofId + '/detail';
    const response = await axios.get(url, {
        headers: headersJson,
        validateStatus: (status) => status === 200,
    });
    return response.data;
}

export async function getProofStatus(proofId: string) {
    const details = await getProofDetails(proofId);
    return details.status
}

function stringArrayToByteArray(arr: string[]) {
    return arr.reduce((acc, hexString) => {
        const lastByte = hexString.slice(-2);
        return acc + lastByte;
    }, '0x');
}

export async function getProofData(proofId: string) {
    const details = await getProofDetails(proofId);
    const proofData = '0x' + details.proof.proof as string
    const tomlResult = TOML.parse(details.public['Verifier.toml']);
    const pub_key_x = stringArrayToByteArray(tomlResult.pub_key_x as string[]);
    const pub_key_y = stringArrayToByteArray(tomlResult.pub_key_y as string[]);
    const nullifier = stringArrayToByteArray(tomlResult.return as string[]);
    return { proofData, pub_key_x, pub_key_y, nullifier };
}