
import MintCard from "@/components/MintCard";
import { getSession } from "@/lib/session";
import { getProofData } from "../actions";

export default async function Mint() {
    const session = await getSession();
    if(!(session && session.proof_id)) {
        return (<>Invalid Session</>);
    }
    const proof = await getProofData(session.proof_id);
    return (<div className="max-w-md mx-auto my-8 w-[350px]">
            <MintCard proofData={proof.proofData} pub_key_x={proof.pub_key_x} pub_key_y={proof.pub_key_y} nullifier={proof.nullifier} />
        </div>
    );
}
