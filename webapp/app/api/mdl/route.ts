import * as jose from 'jose';
import { randomBytes } from 'crypto';

export const dynamic = 'force-dynamic';

function generateNonce(length: number): string {
    return randomBytes(length).toString('hex');
}

export async function GET(request: Request) {
    if (process.env.JWK_PUBLIC && process.env.JWK_PRIVATE_D && process.env.NEXT_PUBLIC_SERVER_DOMAIN) {
        const alg = 'ES256'
        const jwk = JSON.parse(process.env.JWK_PUBLIC);
        jwk.d = process.env.JWK_PRIVATE_D;
        const privKey = await jose.importJWK(jwk, alg);
        const nonce = generateNonce(16);
        const client_id = process.env.NEXT_PUBLIC_CLIENT_ID;
        const kid = `${client_id}#key0`;
        const jwt = await new jose.SignJWT({
            ...mldRequest,
            nonce,
            client_id,
            response_uri: `http://${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/api/mdl`
        })
            .setProtectedHeader({ alg, kid })
            .sign(privKey);

        return new Response(jwt, {
            headers: {
                'Content-Type': 'application/jwt',
            },
        });
    } else {
        throw new Error('Invalid envvars');
    }

}

export async function POST(request: Request) {
    console.log(await request.text());
    return new Response(null, { status: 200 });
}

const mldRequest = {
    aud: "https://self-issued.me/v2",
    client_id_scheme: "did",
    client_metadata: {
        vp_formats: {
            mso_mdoc: {
                alg: [
                    "ES256"
                ]
            }
        }
    },
    presentation_definition: {
        id: "org.iso.18013.5.1",
        input_descriptors: [
            {
                constraints: {
                    fields: [
                        {
                            path: [
                                "$['org.iso.18013.5.1']['family_name']"
                            ],
                            intent_to_retain: false
                        },
                        {
                            path: [
                                "$['org.iso.18013.5.1']['given_name']"
                            ],
                            intent_to_retain: false
                        },
                        {
                            path: [
                                "$['org.iso.18013.5.1']['birth_date']"
                            ],
                            intent_to_retain: false
                        },
                    ],
                    limit_disclosure: "required"
                },
                format: {
                    mso_mdoc: {
                        alg: [
                            "ES256"
                        ]
                    },
                    jwt_vc: {
                        alg: [
                            "ES256"
                        ]
                    }
                },
                id: "anyValue"
            }
        ]
    },
    response_mode: "direct_post",
    response_type: "vp_token"
};