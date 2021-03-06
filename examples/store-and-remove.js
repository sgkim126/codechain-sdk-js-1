const SDK = require("codechain-sdk");

const sdk = new SDK({
    server: process.env.CODECHAIN_RPC_HTTP || "http://localhost:8080",
    networkId: process.env.CODECHAIN_NETWORK_ID || "tc"
});

const ACCOUNT_ADDRESS =
    process.env.ACCOUNT_ADDRESS ||
    "tccq9h7vnl68frvqapzv3tujrxtxtwqdnxw6yamrrgd";
const ACCOUNT_PASSPHRASE = process.env.ACCOUNT_PASSPHRASE || "satoshi";

const privForStore = sdk.util.generatePrivateKey();

(async () => {
    // Store the text with a secret (= private key)
    const store = sdk.core.createStoreTransaction({
        content: "CodeChain",
        secret: privForStore
    });
    const storeResult = await sdk.rpc.account.sendTransaction({
        tx: store,
        account: ACCOUNT_ADDRESS,
        passphrase: ACCOUNT_PASSPHRASE
    });
    const storeHash = storeResult.hash;
    const result1 = await sdk.rpc.chain.containsTransaction(storeHash);
    console.log(result1); // true

    // To get the text, use hash of signed tx
    const text = await sdk.rpc.chain.getText(storeHash);
    console.log(text);
    // Text {
    //   content: 'CodeChain',
    //   certifier: PlatformAddress from privForStore
    // }

    // When remove, hash of signed tx is needed
    const remove = sdk.core.createRemoveTransaction({
        hash: storeHash,
        secret: privForStore
    });
    const removeResult = await sdk.rpc.account.sendTransaction({
        tx: remove,
        account: ACCOUNT_ADDRESS,
        passphrase: ACCOUNT_PASSPHRASE
    });
    const removeHash = removeResult.hash;
    const result2 = await sdk.rpc.chain.containsTransaction(removeHash);
    console.log(result2); // true
})().catch(console.error);
