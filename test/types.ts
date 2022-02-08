import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
export interface Signers {
  admin: SignerWithAddress;
}
export interface Signature {
  signer: string;
  signature: string;
}
export interface accounts {
  ibrahim: SignerWithAddress;
  musa: SignerWithAddress;
  darangi: SignerWithAddress;
  notAWinnerOrCreator: SignerWithAddress;
}
