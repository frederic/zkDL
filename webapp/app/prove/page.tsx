import ProveCard from "@/components/Prove";
import { getSession } from "@/lib/session";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default async function Prove() {
  const session = await getSession();
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
      <ProveCard proof_id={session.proof_id} />
    </div>
  </div>
  );
}
