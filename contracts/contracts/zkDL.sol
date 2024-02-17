// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Votes.sol";
import {UltraVerifier} from "./plonk_vk.sol";

contract ZkDL is ERC721, Ownable, EIP712, ERC721Votes {

    UltraVerifier verifier;
    bytes32 pub_key_x;
    bytes32 pub_key_y;

    constructor(address initialOwner, address _verifier, bytes32 _pub_key_x, bytes32 _pub_key_y)
        ERC721("zkDL", "ZKDL")
        Ownable(initialOwner)
        EIP712("zkDL", "1")
    {
        verifier = UltraVerifier(_verifier);
        pub_key_x = _pub_key_x;
        pub_key_y = _pub_key_y;
    }

    function _baseURI() internal pure override returns (string memory) {
        return "https://zk-dl.vercel.app";
    }

    function safeMint(bytes calldata proof, bytes32 nullifierHash) external {
        //TODO prevent front-running attack
        bytes32[] memory publicInputs = new bytes32[](96);
        for (uint i = 0; i < 32; i++) {
            publicInputs[i] = bytes32(uint256(uint8(pub_key_x[i])));
            publicInputs[i + 32] = bytes32(uint256(uint8(pub_key_y[i])));
            publicInputs[i + 64] = bytes32(uint256(uint8(nullifierHash[i])));
        }
        require(verifier.verify(proof, publicInputs), "Invalid proof");
        _safeMint(msg.sender, uint256(nullifierHash));
    }

    // The following functions are overrides required by Solidity.

    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721Votes)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value)
        internal
        override(ERC721, ERC721Votes)
    {
        super._increaseBalance(account, value);
    }
}
