var SDK = require("codechain-sdk");

var sdk = new SDK({ server: "http://localhost:8080" });

// If you want to know how to create an address, see the example "Create an
// asset transfer address".
var address = "ccaqqqk7n0a0w69tjfza9svdjzhvu95cpl29ssnyn99ml8nvl8q6sd2c7qgjejfc";

var assetMintTransaction = sdk.core.createAssetMintTransaction({
    scheme: {
        shardId: 0,
        metadata: JSON.stringify({
            name: "Silver Coin",
            description: "...",
            icon_url: "...",
        }),
        amount: 100000000,
    },
    recipient: address,
});

// Send a change-shard-state parcel to process the transaction.
var parcel = sdk.core.createChangeShardStateParcel({ transactions: [assetMintTransaction] });
sdk.rpc.chain.sendParcel(parcel, {
    account: "cccqzn9jjm3j6qg69smd7cn0eup4w7z2yu9myd6c4d7",
    passphrase: "satoshi"
}).then(function (parcelHash) {
    // Get the invoice of the parcel.
    return sdk.rpc.chain.getParcelInvoice(parcelHash, {
        // Wait up to 120 seconds to get the invoice.
        timeout: 120 * 1000
    });
}).then(function (invoice) {
    // The invoice of change-shard-state parcel is an array of the object that has
    // type { success: boolean }. Each object represents the result of each
    // transaction.
    console.log(invoice); // [{ success: true }]
});
