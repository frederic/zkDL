'use client'
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import { useAccount } from "wagmi";

export default function Home() {
    const { address, isConnected } = useAccount();
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Connect your wallet</CardTitle>
        <CardDescription>Use Ethereum Sepolia network</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <div style={{ padding: 12 }} >
          <ConnectButton />
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Link href={isConnected ? "/verify" : ""}><Button disabled={!isConnected}>Next</Button></Link>
      </CardFooter>
    </Card>
  );
}
