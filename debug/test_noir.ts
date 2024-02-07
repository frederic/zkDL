import { p256 as P256 } from '@noble/curves/p256';

function main(pub_key_x: number[], pub_key_y: number[], signature: number[], hashed_message: number[]) {
    const pub_pts = {
        x: BigInt('0x' + Buffer.from(pub_key_x).toString('hex')),
        y: BigInt('0x' + Buffer.from(pub_key_y).toString('hex'))
    }
    const pub = P256.ProjectivePoint.fromAffine(pub_pts);
    const pubKey = pub.toHex(true);
    const msgHash = Buffer.from(hashed_message);
    const sig = Buffer.from(signature);
    const result = P256.verify(sig, msgHash, pubKey);
    console.log(result);
}

//from https://github.com/noir-lang/noir/blob/7e139de3499478cf573d2a7ad480f434cb898d9f/test_programs/execution_success/ecdsa_secp256r1/Prover.toml
function verify_noir_sig() {
    let hashed_message = [
        84, 112, 91, 163, 186, 175, 219, 223, 186, 140, 95, 154, 112, 247, 168, 155, 238, 152,
        217, 6, 181, 62, 49, 7, 77, 167, 186, 236, 220, 13, 169, 173
    ];
    let pub_key_x = [
        85, 15, 71, 16, 3, 243, 223, 151, 195, 223, 80, 106, 199, 151, 246, 114, 31, 177, 161,
        251, 123, 143, 111, 131, 210, 36, 73, 138, 101, 200, 142, 36
    ];
    let pub_key_y = [
        19, 96, 147, 215, 1, 46, 80, 154, 115, 113, 92, 189, 11, 0, 163, 204, 15, 244, 181,
        192, 27, 63, 250, 25, 106, 177, 251, 50, 112, 54, 184, 230
    ];
    let signature = [
        44, 112, 168, 208, 132, 182, 43, 252, 92, 224, 54, 65, 202, 249, 247, 42,
        212, 218, 140, 129, 191, 230, 236, 148, 135, 187, 94, 27, 239, 98, 161, 50,
        24, 173, 158, 226, 158, 175, 53, 31, 220, 80, 241, 82, 12, 66, 94, 155,
        144, 138, 7, 39, 139, 67, 176, 236, 123, 135, 39, 120, 193, 78, 7, 132
    ];
    main(pub_key_x, pub_key_y, signature, hashed_message);
}

function verify_custom_sig() {
    let hashed_message = [
        198, 70, 62, 128, 220, 189, 248, 68,
        230, 143, 176, 159, 104, 163, 142, 56,
        11, 176, 80, 38, 37, 6, 142, 14,
        226, 152, 16, 13, 82, 66, 9, 238
    ];

    let pub_key_x = [
        225, 55, 157, 33, 24, 117, 233, 144,
        233, 1, 114, 79, 202, 22, 151, 121,
        197, 232, 198, 128, 124, 63, 162, 214,
        224, 80, 233, 168, 2, 214, 89, 34
    ];

    let pub_key_y = [
        10, 125, 194, 75, 141, 121, 154,
        213, 90, 133, 147, 27, 86, 254,
        206, 163, 146, 203, 230, 230, 150,
        158, 249, 249, 117, 135, 112, 177,
        64, 138, 245, 214
    ];

    let signature = [
        247, 207, 213, 196, 25, 11, 21, 166, 103, 41, 186,
        12, 59, 211, 230, 110, 133, 159, 85, 113, 175, 106,
        222, 243, 205, 138, 210, 253, 153, 163, 145, 136, 211,
        11, 170, 104, 107, 179, 223, 62, 251, 20, 28, 19,
        86, 178, 159, 32, 61, 150, 242, 16, 9, 160, 56,
        27, 131, 235, 233, 2, 59, 249, 109, 220
    ];
    main(pub_key_x, pub_key_y, signature, hashed_message);
}

async function run() {
    console.log('verify_noir_sig:');
    verify_noir_sig()
    console.log('verify_custom_sig:');
    verify_custom_sig()
}

run().catch(console.error);
