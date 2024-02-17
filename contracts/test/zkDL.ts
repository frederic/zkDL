import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
const PROOF = "0x";
const NULLIFIER_HASH = "0x";

describe("zkDL", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployzkDLFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount, thirdAccount] = await ethers.getSigners();

    const UltraVerifier = await ethers.getContractFactory("UltraVerifier", owner);
    const ultraVerifierContract = await UltraVerifier.deploy();
    await ultraVerifierContract.waitForDeployment();

    const pub_key_x = "0xe1379d211875e990e901724fca169779c5e8c6807c3fa2d6e050e9a802d65922";
    const pub_key_y = "0x0a7dc24b8d799ad55a85931b56fecea392cbe6e6969ef9f9758770b1408af5d6";

    const zkDLFactory = await ethers.getContractFactory("ZkDL", owner);
    const zkDl = await zkDLFactory.deploy(
      await owner.getAddress(),
      await ultraVerifierContract.getAddress(),
      pub_key_x,
      pub_key_y
    );

    return { zkDl, owner, otherAccount, thirdAccount };
  }

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const { zkDl, owner } = await loadFixture(deployzkDLFixture);
      expect(await zkDl.owner()).to.equal(owner.address);
    });
  });

  describe("Mint", function () {
    it("Should verify the proof & mint", async function () {
      const { zkDl, owner, otherAccount } = await loadFixture(deployzkDLFixture);
      expect(await zkDl.balanceOf(otherAccount)).to.equal(0);
      await expect(zkDl.connect(otherAccount).safeMint(PROOF, NULLIFIER_HASH))
        .to.emit(zkDl, 'Transfer')
        .withArgs(ZERO_ADDRESS, otherAccount.address, NULLIFIER_HASH);
      expect(await zkDl.balanceOf(otherAccount.address)).to.equal(1);
      expect(await zkDl.owner()).to.equal(owner.address);
      expect(await zkDl.ownerOf(NULLIFIER_HASH)).to.equal(otherAccount.address);
    });

    it("Should verify the proof, mint & revert", async function () {
      const { zkDl, owner, otherAccount, thirdAccount } = await loadFixture(deployzkDLFixture);
      expect(await zkDl.balanceOf(otherAccount)).to.equal(0);
      await expect(zkDl.connect(otherAccount).safeMint(PROOF, NULLIFIER_HASH))
        .to.emit(zkDl, 'Transfer')
        .withArgs(ZERO_ADDRESS, otherAccount.address, NULLIFIER_HASH);
      expect(await zkDl.balanceOf(otherAccount.address)).to.equal(1);
      expect(await zkDl.owner()).to.equal(owner.address);
      expect(await zkDl.ownerOf(NULLIFIER_HASH)).to.equal(otherAccount.address);

      expect(await zkDl.balanceOf(thirdAccount.address)).to.equal(0);
      await expect(zkDl.connect(thirdAccount).safeMint(PROOF, NULLIFIER_HASH)).to.be.revertedWithCustomError(
        zkDl,
        "ERC721InvalidSender"
      );
      expect(await zkDl.balanceOf(thirdAccount.address)).to.equal(0);
      expect(await zkDl.balanceOf(otherAccount.address)).to.equal(1);
    });
  });
});
