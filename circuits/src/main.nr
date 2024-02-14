use dep::std;
use dep::sha2::sha256;

fn main(
    pub_key_x: [u8; 32],
    pub_key_y: [u8; 32],
    signature: [u8; 64],
    mso: [u8; 2560],
    mso_len: u16,
    digestId: [u8; 4],
    random: [u8; 16],
    docNum: [u8; 8],
    docNumOffset: u16
) -> pub [u8; 32] {
    assert(docNumOffset + 4 + 2 + 32 < mso_len);
    let mut docNumItem: [u8; 99] = [
        0xD8, 0x18, 0x58, 0x5F, 0xA4, 0x68, 0x64, 0x69, 0x67, 0x65, 0x73, 0x74, 0x49, 0x44, 0x1A, 0x0, 0x0, 0x0, 0x0, 0x66, 0x72, 0x61, 0x6E, 0x64, 0x6F, 0x6D, 0x50, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x71, 0x65, 0x6C, 0x65, 0x6D, 0x65, 0x6E, 0x74, 0x49, 0x64, 0x65, 0x6E, 0x74, 0x69, 0x66, 0x69, 0x65, 0x72, 0x6F, 0x64, 0x6F, 0x63, 0x75, 0x6D, 0x65, 0x6E, 0x74, 0x5F, 0x6E, 0x75, 0x6D, 0x62, 0x65, 0x72, 0x6C, 0x65, 0x6C, 0x65, 0x6D, 0x65, 0x6E, 0x74, 0x56, 0x61, 0x6C, 0x75, 0x65, 0x68, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0
    ];

    for i in 0..digestId.len() {
        docNumItem[15 + i] = digestId[i];
    }
    for i in 0..random.len() {
        docNumItem[27 + i] = random[i];
    }
    for i in 0..docNum.len() {
        docNumItem[91 + i] = docNum[i];
    }
    let hash = std::hash::sha256(docNumItem);

    let fDocNumOffset = docNumOffset as Field;
    for i in 0..digestId.len() {
        assert(digestId[i] == mso[fDocNumOffset + i]);
    }
    assert(mso[fDocNumOffset + digestId.len()] == 0x58);
    assert(mso[fDocNumOffset + digestId.len() + 1] == 0x20); //hash size: 32 bytes
    for i in 0..hash.len() {
        assert(hash[i] == mso[fDocNumOffset + digestId.len() + 2 + i]);
    }

    let msg_hash = sha256(mso, mso_len);
    let x = std::ecdsa_secp256r1::verify_signature(pub_key_x, pub_key_y, signature, msg_hash);
    assert(x == true);
    std::hash::sha256(docNum)
}

//from https://github.com/noir-lang/noir/blob/7e139de3499478cf573d2a7ad480f434cb898d9f/test_programs/execution_success/ecdsa_secp256r1/Prover.toml
#[test]
fn verify_noir_sig() {
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

#[test]
fn verify_custom_sig() {
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
