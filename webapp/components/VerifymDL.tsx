'use client'
import { getProofIdByToken, getSessionToken, pollForStatus, refreshSessionToken, signOut } from "@/app/actions";
import { useQRCode } from "next-qrcode";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";

export default function VerifymDL() {
    const [token, setToken] = useState("")
    useEffect(() => {
        const fetchToken = async () => {
            const token = await getSessionToken();
            setToken(token);
        }

        fetchToken()
    }, [])
    const { SVG } = useQRCode();
    const url = `http://${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/api/callback/${token}`;

    async function refreshToken() {
        const newToken = await refreshSessionToken();
        setToken(newToken);
    }

    async function nextHandler() {
        const proofId = await getProofIdByToken(token);
        if (proofId) {

        }
    }
    return (
        <Card className="w-[350px]">
            <CardHeader>
                <CardTitle>Verify your mDL</CardTitle>
                <CardDescription>Scan with zkDL Reader mobile app</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col">
                    <SVG
                        text={url}
                        options={{
                            margin: 2,
                            width: 200,
                            color: {
                                dark: '#010599FF',
                                light: '#FFBF60FF',
                            },
                        }}
                    />
                    {url}
                </div>
            </CardContent>
            <CardFooter className="flex justify-between">
                <Button onClick={refreshToken} variant="outline">Refresh</Button>
                <Button onClick={nextHandler}>Next</Button>
            </CardFooter>
        </Card>
    );
}