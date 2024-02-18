'use client'
import { abi } from "@/lib/contract-abi";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt
} from 'wagmi';
import { useEffect, useState } from "react";
import Link from "next/link";

const zkDLContractConfig = {
  address: process.env.NEXT_PUBLIC_ZKDL_CONTRACT_ADDRESS as `0x${string}`,
  abi,
} as const;

type ProofProps = {
  proofData: string;
  pub_key_x: string;
  pub_key_y: string;
  nullifier: string;
}

export default function MintCard(proof: ProofProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const [alreadyMinted, setAlreadyMinted] = useState(false);

  const { isConnected } = useAccount();

  const tokenId = BigInt(proof.nullifier);
  const { data: tokenOwner } = useReadContract({
    ...zkDLContractConfig,
    functionName: 'ownerOf',
    args: [tokenId],
  });
  useEffect(() => {
    if (tokenOwner) {
      setAlreadyMinted(true);
    }
  }, [tokenOwner]);

  const {
    data: hash,
    writeContract: zkDLMint,
    isPending: isMintLoading,
    isSuccess: isMintStarted,
    error: mintError,
  } = useWriteContract();

  const {
    data: txData,
    isSuccess: txSuccess,
    error: txError,
  } = useWaitForTransactionReceipt({
    hash,
    query: {
      enabled: !!hash,
    },
  });

  const isMinted = txSuccess;

  function mintHandler() {
    zkDLMint({
      ...zkDLContractConfig,
      functionName: 'safeMint',
      args: [proof.proofData as `0x${string}`, proof.nullifier as `0x${string}`]
    });
  }

  function getNftUrl(tokenId:string): string {
    return `https://sepolia.etherscan.io/token/${zkDLContractConfig.address}?a=${tokenId}`
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mint your NFT</CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent>
        {mintError && (
          <p style={{ marginTop: 24, color: '#FF6257' }}>
            Error: {mintError.message}
          </p>
        )}
        {txError && (
          <p style={{ marginTop: 24, color: '#FF6257' }}>
            Error: {txError.message}
          </p>
        )}
        {mounted && !isConnected && (<span>Please connect your wallet.</span>)}
        {mounted && isConnected && !isMinted && !alreadyMinted && (
          <span>Ready to mint, please proceed!</span>
        )}
        {mounted && isConnected && !isMinted && alreadyMinted && (
          <span>You&apos;ve already minted your <Link href={getNftUrl(proof.nullifier)} target="_blank" className="underline">NFT!</Link></span>
        )}
        {mounted && isConnected && isMinted && (
          <span>Congratulations, <Link href={getNftUrl(proof.nullifier)} target="_blank" className="underline">your NFT is ready!</Link></span>
        )}
      </CardContent>
      <CardFooter className="flex justify-center">
        {mounted && isConnected && !isMinted && (
          <Button
            style={{ marginTop: 24 }}
            disabled={!zkDLMint || isMintLoading || isMintStarted || alreadyMinted}
            className="button"
            data-mint-loading={isMintLoading}
            data-mint-started={isMintStarted}
            onClick={mintHandler}
          >
            {isMintLoading && 'Waiting for approval'}
            {isMintStarted && 'Minting...'}
            {!isMintLoading && !isMintStarted && !alreadyMinted && 'Mint'}
            {alreadyMinted && 'Already minted!'}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}