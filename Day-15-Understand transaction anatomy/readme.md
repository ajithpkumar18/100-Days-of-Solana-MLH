### Understand transaction anatomy

Arc theme: Transactions and state changes

Web2 bridge: A Solana transaction is like an HTTP request with built-in authentication, an expiration timestamp, and atomic execution.

## The Scenario

You’ve been reading data from Solana for the past week. Now it’s time to understand how data gets written. Every state change on Solana happens through a transaction: a signed message containing one or more instructions that tell programs what to do. Before you send your first transaction, let’s understand what one looks like inside. In Web2, if you’ve ever inspected an HTTP request in your browser’s DevTools and looked at the headers, body, and method, you already know what this feels like. A Solana transaction has a similar anatomy: a structured message with a header, a list of accounts, instructions telling programs what to do, and signatures proving who authorized it. Understanding this structure is the difference between copying code snippets and actually knowing what your code is sending to the network.

## The Challenge

What You’ll Need
Your Solana CLI, configured for devnet (solana config set --url devnet)
A funded devnet wallet (run solana airdrop 1 if you need SOL)
A terminal
Solana Explorer open in your browser

> Note: The devnet airdrop can sometimes fail due to rate limiting. If this happens use the web faucet instead.
> Steps
> Send a quick transfer on devnet so you have a transaction to inspect. This is your first time sending SOL, so pay attention to what happens:
> solana-keygen new --no-bip39-passphrase -o /tmp/temp-wallet.json
> solana transfer --allow-unfunded-recipient $(solana address -k /tmp/temp-wallet.json) 0.001 --url devnet
> Copy the transaction signature that gets printed to your terminal. It looks like a long base-58 string. This signature is not just a receipt. It is the first signature in the transaction and doubles as the transaction’s unique ID.

Inspect the transaction with the CLI. Use the solana confirm command with the verbose flag to pull apart the transaction:
solana confirm -v YOUR_TRANSACTION_SIGNATURE
You’ll see output that includes the transaction’s status, the slot it was processed in, the accounts involved, and the instructions that were executed. Take a moment to read through it.

Now open it in Solana Explorer. Paste your transaction signature into the search bar at explorer.solana.com. Make sure you switch the cluster to “Devnet” using the dropdown at the top of the page. The Explorer gives you a visual breakdown of the same data. Look for these sections:

- Signature(s): The Ed25519 signatures that authorize this transaction. Each is 64 bytes. Your simple transfer has one signature (from your wallet). The first signature is also the transaction ID.
  Account Keys: The list of public keys for every account the transaction touches. Look at how they are grouped: the fee payer comes first, then other signers, then read-only accounts. This ordering is not random. It maps to the message header.
  Recent Blockhash: A 32-byte hash of a recent block. This serves two purposes: it proves the transaction was created recently (blockhashes expire after about 150 slots, roughly 60-90 seconds), and it prevents the exact same transaction from being processed twice.

- Instruction(s): The actual operations. Your transfer has one instruction that invokes the System Program with a “Transfer” command, the source account, the destination account, and the amount in lamports.
  Map it to the official structure. Every Solana transaction is made up of two top-level parts:

Signatures: A compact array of 64-byte Ed25519 signatures. The number of signatures must match the num_required_signatures value in the message header.
Message: The payload that was signed. It contains:
Header: Three single-byte numbers describing how many signatures are required, how many of those signers are read-only, and how many unsigned accounts are read-only. These three numbers partition the account keys array into permission groups without needing per-account metadata flags.
Account Keys: A compact array of 32-byte public keys for every account referenced by any instruction.
Recent Blockhash: The 32-byte blockhash described above.
Instructions: A compact array of compiled instructions. Each compiled instruction contains a program ID index (pointing into the account keys array), an array of account indexes (also pointing into account keys), and a data byte array that the program interprets.
The entire serialized transaction must fit within 1,232 bytes. That limit comes from the IPv6 minimum MTU (1,280 bytes) minus 48 bytes of network headers. It is one of the tightest constraints in Solana development and the reason Address Lookup Tables exist for complex transactions.

- Compare it to HTTP. Think of it this way:

The message header is like HTTP headers, providing metadata about permissions and structure.
The account keys are like the URL paths and query parameters, telling the network which resources are involved.
The instructions are like the request body, containing the actual operations you want performed.
The signatures are like authentication tokens, providing proof that the sender authorized this request.
The recent blockhash is like a CSRF token with a short expiry, preventing replay attacks and proving freshness.
The key difference? HTTP requests are processed by one server. Solana transactions are validated by every validator in the network, and if any instruction in the transaction fails, all of them are rolled back atomically. Fees are still charged even on failure.

## What Just Happened

You dissected a real transaction down to its raw components. Instead of treating a transfer as a black box, you now know that it is a signed message containing a header (permission groups), a list of account keys (the resources involved), a recent blockhash (freshness proof and replay protection), and one or more compiled instructions (the actual operations). Each instruction points into the account keys array by index, which is why the ordering of accounts matters and why the header’s three numbers can define permissions for the entire array without any per-account flags.

This structure applies to every transaction on Solana, whether it is a simple SOL transfer, a token swap, or a complex DeFi operation with multiple instructions bundled together. The 1,232-byte size limit means you cannot stuff unlimited accounts into a single transaction. For cases where you need more, Solana introduced versioned transactions with Address Lookup Tables, which compress 32-byte addresses down to 1-byte indexes by referencing an on-chain table. You will encounter these as your programs grow more complex.
