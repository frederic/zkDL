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
    <VerifymDL />
    </div>
  );
}