import { p256 } from '@noble/curves/p256';
import axios from 'axios';
const cbor = require('cbor')

export const dynamic = 'force-dynamic';

type MDLResponse = {
    coseSign: string;
    derSignature: string;
    issuerData: string;
    publicKey: string;
}
function generate_proof(input:MDLResponse): string {
    let result = ''
    const mdoc = cbor.decodeFirstSync(input.issuerData)
    const docNumItem = cbor.decodeFirstSync(mdoc['nameSpaces']['org.iso.18013.5.1'][0].value)
    const enc = new TextEncoder(); 
    const digestId = Buffer.alloc(4);
    digestId.writeUint32BE(docNumItem['digestID'], 0);
    result += "digestId = [" + Array.from(digestId) + "]\n"
    result += "random = [" + Array.from(docNumItem['random']) + "]\n"
    result += "docNum = [" + Array.from(docNumItem['elementValue'], (chr: string) => chr.charCodeAt(0)) + "]\n"

    const mso = Buffer.from(input.coseSign, 'hex')
    const mso_array = new Uint8Array(2560)
    mso_array.set(mso, 0)
    result += "mso_len = " + mso.byteLength + "\n"
    result += "mso = [" + mso_array.toString() + "]\n"
    result += "docNumOffset = " + mso.indexOf(digestId) + "\n"
    let sig = p256.Signature.fromDER(input.derSignature)
    if(sig.hasHighS()){
        sig = sig.normalizeS();
    }
    result += "signature = [" + sig.toCompactRawBytes() + "]\n"

    const pub_key_x = [225, 55, 157, 33, 24, 117, 233, 144, 233, 1, 114, 79, 202, 22, 151, 121, 197, 232, 198, 128, 124, 63, 162, 214, 224, 80, 233, 168, 2, 214, 89, 34]
    const pub_key_y = [10, 125, 194, 75, 141, 121, 154, 213, 90, 133, 147, 27, 86, 254, 206, 163, 146, 203, 230, 230, 150, 158, 249, 249, 117, 135, 112, 177, 64, 138, 245, 214]
    result += "pub_key_x = [" + pub_key_x + "]\n"
    result += "pub_key_y = [" + pub_key_y + "]\n"
    return result
}

export async function POST(request: Request, { params }: { params: { token: string } }) {
    const sindriApiKey = process.env.SINDRI_API_KEY;
    const sindriCircuitId = process.env.SINDRI_CIRCUIT_ID;
    const sindriApiUrl = 'https://sindri.app/api/v1';
    if(!(sindriApiKey && sindriCircuitId)) {
        return new Response(null, { status: 500 });
    }
    const proofInput = generate_proof(await request.json());
    console.log(proofInput);
    console.log(params)
    const headersJson  = {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
        Authorization: `Bearer ${sindriApiKey}`
      };
    const proveResponse = await axios.post(
        sindriApiUrl + `/circuit/${sindriCircuitId}/prove`,
        { proof_input: proofInput },
        { headers: headersJson, validateStatus: (status) => status === 201 },
      );
    const proofId = proveResponse.data.proof_id;
    console.log(proofId)
    return new Response(null, { status: 200 });
}