import { ethers } from "hardhat";

async function main() {
  const [owner] = await ethers.getSigners();

  const ultraVerifierContract = await ethers.deployContract("UltraVerifier");
  await ultraVerifierContract.waitForDeployment();
  console.log(
    `UltraVerifier deployed to ${ultraVerifierContract.target}`
  );

  const pub_key_x = "0xe1379d211875e990e901724fca169779c5e8c6807c3fa2d6e050e9a802d65922";
  const pub_key_y = "0x0a7dc24b8d799ad55a85931b56fecea392cbe6e6969ef9f9758770b1408af5d6";
  const zkDl = await ethers.deployContract("ZkDL", [
    await owner.getAddress(),
    await ultraVerifierContract.getAddress(),
    pub_key_x,
    pub_key_y]
  );
  await zkDl.waitForDeployment();

  console.log(
    `zkDl deployed to ${zkDl.target}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
