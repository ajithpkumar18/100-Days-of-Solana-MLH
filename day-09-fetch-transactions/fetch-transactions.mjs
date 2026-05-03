import { createSolanaRpc, devnet, address } from "@solana/kit";

// Connect to devnet (Solana's test network)
const rpc = createSolanaRpc(devnet("https://api.devnet.solana.com"));

// Replace this with the wallet address you created on Day 1
const public_address = "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb";
const targetAddress = address(public_address);

// Fetch the 5 most recent transaction signatures for this address
const signatures = await rpc
	.getSignaturesForAddress(targetAddress, { limit: 5 })
	.send();

console.log(`\nLast 5 transactions for ${targetAddress}:\n`);

for (const tx of signatures) {
	const time = tx.blockTime
		? new Date(Number(tx.blockTime) * 1000).toLocaleString()
		: "unknown";

	console.log(`Signature : ${tx.signature}`);
	console.log(`Slot      : ${tx.slot}`);
	console.log(`Time      : ${time}`);
	console.log(`Status    : ${tx.err ? "Failed" : "Success"}`);
	console.log("---");
}
