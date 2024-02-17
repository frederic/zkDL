import VerifymDL from "@/components/VerifymDL";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Verify() {
  return (<div>
    <div
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        padding: 12,
      }}
    >
      <ConnectButton />
    </div>
    <div className="max-w-md mx-auto my-8 w-[350px]">
      <VerifymDL />
    </div>
    </div>
  );
}
