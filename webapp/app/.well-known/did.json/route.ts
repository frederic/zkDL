export const dynamic = 'force-static';

const did = {
    "id": process.env.NEXT_PUBLIC_CLIENT_ID,
    "@context": [
        "https://www.w3.org/ns/did/v1",
        {
            "@base": process.env.NEXT_PUBLIC_CLIENT_ID
        }
    ],
    "service": [
        {
            "id": "#linkeddomains",
            "type": "LinkedDomains",
            "serviceEndpoint": {
                "origins": [
                    process.env.NEXT_PUBLIC_CLIENT_ID
                ]
            }
        },
        {
            "id": "#hub",
            "type": "IdentityHub",
            "serviceEndpoint": {
                "instances": [
                    ""//TODO
                ]
            }
        }
    ],
    "verificationMethod": [
        {
            "id": "#key0",
            "controller": process.env.NEXT_PUBLIC_CLIENT_ID,
            "type": "EcdsaSecp256k1VerificationKey2019",//TODO
            publicKeyJwk: JSON.parse(process.env.JWK_PUBLIC)
        }
    ],
    "authentication": [
        "#key0"
    ],
    "assertionMethod": [
        "#key0"
    ]
}

export async function GET(request: Request) {
    return Response.json(did);
}