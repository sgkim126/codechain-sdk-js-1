import { NoopTransaction } from "./NoopTransaction";
import { PaymentTransaction } from "./PaymentTransaction";
import { SetRegularKeyTransaction } from "./SetRegularKeyTransaction";
import { AssetMintTransaction } from "./AssetMintTransaction";
import { AssetTransferTransaction } from "./AssetTransferTransaction";

export type Transaction =
    NoopTransaction
    | PaymentTransaction
    | SetRegularKeyTransaction
    | AssetMintTransaction
    | AssetTransferTransaction;

export { NoopTransaction, PaymentTransaction, SetRegularKeyTransaction, AssetMintTransaction, AssetTransferTransaction };

export const getTransactionFromJSON = (obj: string | any) => {
    if (obj === "noop") {
        return new NoopTransaction();
    }

    const keys = Object.keys(obj);
    if (keys.length !== 1) {
        throw new Error(`Unexpected transaction keys: ${keys}`);
    }
    const type = keys[0];
    switch (type) {
    case "payment":
        return new PaymentTransaction(obj[type]);
    case "setRegularKey":
        return new SetRegularKeyTransaction(obj[type]);
    case "assetMint":
        return new AssetMintTransaction(obj[type]);
    case "assetTransfer":
        throw new Error(`Unimplemented gettTransactionFromJSON for ${type}`);
    default:
        throw new Error(`Unexpected transaction type: ${type}`);
    }
};