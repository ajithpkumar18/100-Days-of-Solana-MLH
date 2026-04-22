import { createSolanaRpc, devnet } from "@solana/kit";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

const rpc = createSolanaRpc(devnet("https://api.devnet.solana.com"));

async function sol() {
	const address = "AxrYciB9S9eHfk4mGJx2isKJLxLyPmDcQcrmUUPQyyUM";

	const response = await rpc.getBalance(address).send();

	const balanceLamports = response.value;
	console.log("Lamports:", balanceLamports);

	const balanceSOL = Number(balanceLamports) / LAMPORTS_PER_SOL;
	console.log("SOL:", balanceSOL);
}

sol();
