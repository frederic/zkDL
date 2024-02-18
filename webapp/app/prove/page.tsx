import ProveCard from "@/components/Prove";
import { getSession } from "@/lib/session";

export default async function Prove() {
  const session = await getSession();
  return (
    <div className="max-w-md mx-auto my-8 w-[350px]">
      <ProveCard proof_id={session.proof_id} />
    </div>
  );
}
