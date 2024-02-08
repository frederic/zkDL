'use client'
import { useQRCode } from "next-qrcode";
import Link from "next/link";

export default function VerifymDL() {
    const { SVG } = useQRCode();
    const url = `openid-vc://?client_id=did:web:${process.env.NEXT_PUBLIC_SERVER_DOMAIN}&request_uri=http://${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/api/mdl&client_id_scheme=redirect_uri`;
    return (<div className="flex flex-col">
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
    <Link className="underline" href={url} >On mobile ? click here instead.</Link>
    </div>);
}