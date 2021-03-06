/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  ethers,
  EventFilter,
  Signer,
  BigNumber,
  BigNumberish,
  PopulatedTransaction,
  BaseContract,
  ContractTransaction,
  Overrides,
  PayableOverrides,
  CallOverrides,
} from "ethers";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";
import type { TypedEventFilter, TypedEvent, TypedListener } from "./common";

interface NftAuctionInterface extends ethers.utils.Interface {
  functions: {
    "auctions(uint256)": FunctionFragment;
    "bid(uint256,address,address,bytes,string)": FunctionFragment;
    "createAuction(address,uint256,address)": FunctionFragment;
    "createAuctionWithMultipleNfts(address[],uint256[],address)": FunctionFragment;
    "getAuction(uint256)": FunctionFragment;
    "quickFinish(uint256)": FunctionFragment;
    "setMinimumBid(uint256,uint256)": FunctionFragment;
    "settleAuction(uint256)": FunctionFragment;
    "withdrawFund()": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "auctions",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "bid",
    values: [BigNumberish, string, string, BytesLike, string]
  ): string;
  encodeFunctionData(
    functionFragment: "createAuction",
    values: [string, BigNumberish, string]
  ): string;
  encodeFunctionData(
    functionFragment: "createAuctionWithMultipleNfts",
    values: [string[], BigNumberish[], string]
  ): string;
  encodeFunctionData(
    functionFragment: "getAuction",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "quickFinish",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "setMinimumBid",
    values: [BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "settleAuction",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "withdrawFund",
    values?: undefined
  ): string;

  decodeFunctionResult(functionFragment: "auctions", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "bid", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "createAuction",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "createAuctionWithMultipleNfts",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getAuction", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "quickFinish",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setMinimumBid",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "settleAuction",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "withdrawFund",
    data: BytesLike
  ): Result;

  events: {
    "AuctionCreated(address,uint256,address)": EventFragment;
    "AuctionEnded(address,uint256)": EventFragment;
    "AuctionSettled(address,address)": EventFragment;
    "BidMade(address,uint256,uint256)": EventFragment;
    "MinimumBidUpdated(address,uint256,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "AuctionCreated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "AuctionEnded"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "AuctionSettled"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "BidMade"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "MinimumBidUpdated"): EventFragment;
}

export type AuctionCreatedEvent = TypedEvent<
  [string, BigNumber, string] & {
    creator: string;
    auctionId: BigNumber;
    acceptedERC20Token: string;
  }
>;

export type AuctionEndedEvent = TypedEvent<
  [string, BigNumber] & { creator: string; auctionId: BigNumber }
>;

export type AuctionSettledEvent = TypedEvent<
  [string, string] & { winner: string; settledBy: string }
>;

export type BidMadeEvent = TypedEvent<
  [string, BigNumber, BigNumber] & {
    bidder: string;
    bid: BigNumber;
    auctionId: BigNumber;
  }
>;

export type MinimumBidUpdatedEvent = TypedEvent<
  [string, BigNumber, BigNumber] & {
    creator: string;
    auctionId: BigNumber;
    amount: BigNumber;
  }
>;

export class NftAuction extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  listeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter?: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): Array<TypedListener<EventArgsArray, EventArgsObject>>;
  off<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  on<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  once<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeListener<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeAllListeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): this;

  listeners(eventName?: string): Array<Listener>;
  off(eventName: string, listener: Listener): this;
  on(eventName: string, listener: Listener): this;
  once(eventName: string, listener: Listener): this;
  removeListener(eventName: string, listener: Listener): this;
  removeAllListeners(eventName?: string): this;

  queryFilter<EventArgsArray extends Array<any>, EventArgsObject>(
    event: TypedEventFilter<EventArgsArray, EventArgsObject>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEvent<EventArgsArray & EventArgsObject>>>;

  interface: NftAuctionInterface;

  functions: {
    auctions(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [
        string,
        string,
        boolean,
        boolean,
        boolean,
        BigNumber,
        BigNumber,
        BigNumber,
        string,
        string
      ] & {
        creator: string;
        recipient: string;
        quickFinish: boolean;
        ended: boolean;
        settled: boolean;
        minimumBid: BigNumber;
        endTime: BigNumber;
        highestBid: BigNumber;
        highestBidder: string;
        acceptedERC20Token: string;
      }
    >;

    "bid(uint256,address,address,bytes,string)"(
      _auctionId: BigNumberish,
      bidERC20Token: string,
      recipient: string,
      signature: BytesLike,
      message: string,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    "bid(uint256,address)"(
      _auctionId: BigNumberish,
      bidERC20Token: string,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    createAuction(
      nftContractAddress: string,
      tokenId: BigNumberish,
      acceptedERC20Token: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    createAuctionWithMultipleNfts(
      nftContractAddresses: string[],
      tokenIds: BigNumberish[],
      acceptedERC20token: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    getAuction(
      _auctionId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [
        string,
        boolean,
        ([string, BigNumber] & {
          contractAddress: string;
          tokenId: BigNumber;
        })[],
        BigNumber,
        BigNumber,
        BigNumber,
        string,
        string,
        boolean
      ] & {
        creator: string;
        ended: boolean;
        nfts: ([string, BigNumber] & {
          contractAddress: string;
          tokenId: BigNumber;
        })[];
        minimumBid: BigNumber;
        endTime: BigNumber;
        highestBid: BigNumber;
        highestBidder: string;
        acceptedERC20Token: string;
        _quickFinish: boolean;
      }
    >;

    quickFinish(
      _auctionId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setMinimumBid(
      _auctionId: BigNumberish,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    settleAuction(
      _auctionId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    withdrawFund(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  auctions(
    arg0: BigNumberish,
    overrides?: CallOverrides
  ): Promise<
    [
      string,
      string,
      boolean,
      boolean,
      boolean,
      BigNumber,
      BigNumber,
      BigNumber,
      string,
      string
    ] & {
      creator: string;
      recipient: string;
      quickFinish: boolean;
      ended: boolean;
      settled: boolean;
      minimumBid: BigNumber;
      endTime: BigNumber;
      highestBid: BigNumber;
      highestBidder: string;
      acceptedERC20Token: string;
    }
  >;

  "bid(uint256,address,address,bytes,string)"(
    _auctionId: BigNumberish,
    bidERC20Token: string,
    recipient: string,
    signature: BytesLike,
    message: string,
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  "bid(uint256,address)"(
    _auctionId: BigNumberish,
    bidERC20Token: string,
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  createAuction(
    nftContractAddress: string,
    tokenId: BigNumberish,
    acceptedERC20Token: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  createAuctionWithMultipleNfts(
    nftContractAddresses: string[],
    tokenIds: BigNumberish[],
    acceptedERC20token: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  getAuction(
    _auctionId: BigNumberish,
    overrides?: CallOverrides
  ): Promise<
    [
      string,
      boolean,
      ([string, BigNumber] & { contractAddress: string; tokenId: BigNumber })[],
      BigNumber,
      BigNumber,
      BigNumber,
      string,
      string,
      boolean
    ] & {
      creator: string;
      ended: boolean;
      nfts: ([string, BigNumber] & {
        contractAddress: string;
        tokenId: BigNumber;
      })[];
      minimumBid: BigNumber;
      endTime: BigNumber;
      highestBid: BigNumber;
      highestBidder: string;
      acceptedERC20Token: string;
      _quickFinish: boolean;
    }
  >;

  quickFinish(
    _auctionId: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setMinimumBid(
    _auctionId: BigNumberish,
    amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  settleAuction(
    _auctionId: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  withdrawFund(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    auctions(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [
        string,
        string,
        boolean,
        boolean,
        boolean,
        BigNumber,
        BigNumber,
        BigNumber,
        string,
        string
      ] & {
        creator: string;
        recipient: string;
        quickFinish: boolean;
        ended: boolean;
        settled: boolean;
        minimumBid: BigNumber;
        endTime: BigNumber;
        highestBid: BigNumber;
        highestBidder: string;
        acceptedERC20Token: string;
      }
    >;

    "bid(uint256,address,address,bytes,string)"(
      _auctionId: BigNumberish,
      bidERC20Token: string,
      recipient: string,
      signature: BytesLike,
      message: string,
      overrides?: CallOverrides
    ): Promise<void>;

    "bid(uint256,address)"(
      _auctionId: BigNumberish,
      bidERC20Token: string,
      overrides?: CallOverrides
    ): Promise<void>;

    createAuction(
      nftContractAddress: string,
      tokenId: BigNumberish,
      acceptedERC20Token: string,
      overrides?: CallOverrides
    ): Promise<void>;

    createAuctionWithMultipleNfts(
      nftContractAddresses: string[],
      tokenIds: BigNumberish[],
      acceptedERC20token: string,
      overrides?: CallOverrides
    ): Promise<void>;

    getAuction(
      _auctionId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [
        string,
        boolean,
        ([string, BigNumber] & {
          contractAddress: string;
          tokenId: BigNumber;
        })[],
        BigNumber,
        BigNumber,
        BigNumber,
        string,
        string,
        boolean
      ] & {
        creator: string;
        ended: boolean;
        nfts: ([string, BigNumber] & {
          contractAddress: string;
          tokenId: BigNumber;
        })[];
        minimumBid: BigNumber;
        endTime: BigNumber;
        highestBid: BigNumber;
        highestBidder: string;
        acceptedERC20Token: string;
        _quickFinish: boolean;
      }
    >;

    quickFinish(
      _auctionId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    setMinimumBid(
      _auctionId: BigNumberish,
      amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    settleAuction(
      _auctionId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    withdrawFund(overrides?: CallOverrides): Promise<void>;
  };

  filters: {
    "AuctionCreated(address,uint256,address)"(
      creator?: null,
      auctionId?: null,
      acceptedERC20Token?: null
    ): TypedEventFilter<
      [string, BigNumber, string],
      { creator: string; auctionId: BigNumber; acceptedERC20Token: string }
    >;

    AuctionCreated(
      creator?: null,
      auctionId?: null,
      acceptedERC20Token?: null
    ): TypedEventFilter<
      [string, BigNumber, string],
      { creator: string; auctionId: BigNumber; acceptedERC20Token: string }
    >;

    "AuctionEnded(address,uint256)"(
      creator?: null,
      auctionId?: null
    ): TypedEventFilter<
      [string, BigNumber],
      { creator: string; auctionId: BigNumber }
    >;

    AuctionEnded(
      creator?: null,
      auctionId?: null
    ): TypedEventFilter<
      [string, BigNumber],
      { creator: string; auctionId: BigNumber }
    >;

    "AuctionSettled(address,address)"(
      winner?: null,
      settledBy?: null
    ): TypedEventFilter<
      [string, string],
      { winner: string; settledBy: string }
    >;

    AuctionSettled(
      winner?: null,
      settledBy?: null
    ): TypedEventFilter<
      [string, string],
      { winner: string; settledBy: string }
    >;

    "BidMade(address,uint256,uint256)"(
      bidder?: null,
      bid?: null,
      auctionId?: null
    ): TypedEventFilter<
      [string, BigNumber, BigNumber],
      { bidder: string; bid: BigNumber; auctionId: BigNumber }
    >;

    BidMade(
      bidder?: null,
      bid?: null,
      auctionId?: null
    ): TypedEventFilter<
      [string, BigNumber, BigNumber],
      { bidder: string; bid: BigNumber; auctionId: BigNumber }
    >;

    "MinimumBidUpdated(address,uint256,uint256)"(
      creator?: null,
      auctionId?: null,
      amount?: null
    ): TypedEventFilter<
      [string, BigNumber, BigNumber],
      { creator: string; auctionId: BigNumber; amount: BigNumber }
    >;

    MinimumBidUpdated(
      creator?: null,
      auctionId?: null,
      amount?: null
    ): TypedEventFilter<
      [string, BigNumber, BigNumber],
      { creator: string; auctionId: BigNumber; amount: BigNumber }
    >;
  };

  estimateGas: {
    auctions(arg0: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    "bid(uint256,address,address,bytes,string)"(
      _auctionId: BigNumberish,
      bidERC20Token: string,
      recipient: string,
      signature: BytesLike,
      message: string,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    "bid(uint256,address)"(
      _auctionId: BigNumberish,
      bidERC20Token: string,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    createAuction(
      nftContractAddress: string,
      tokenId: BigNumberish,
      acceptedERC20Token: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    createAuctionWithMultipleNfts(
      nftContractAddresses: string[],
      tokenIds: BigNumberish[],
      acceptedERC20token: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    getAuction(
      _auctionId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    quickFinish(
      _auctionId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setMinimumBid(
      _auctionId: BigNumberish,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    settleAuction(
      _auctionId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    withdrawFund(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    auctions(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "bid(uint256,address,address,bytes,string)"(
      _auctionId: BigNumberish,
      bidERC20Token: string,
      recipient: string,
      signature: BytesLike,
      message: string,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    "bid(uint256,address)"(
      _auctionId: BigNumberish,
      bidERC20Token: string,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    createAuction(
      nftContractAddress: string,
      tokenId: BigNumberish,
      acceptedERC20Token: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    createAuctionWithMultipleNfts(
      nftContractAddresses: string[],
      tokenIds: BigNumberish[],
      acceptedERC20token: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    getAuction(
      _auctionId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    quickFinish(
      _auctionId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setMinimumBid(
      _auctionId: BigNumberish,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    settleAuction(
      _auctionId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    withdrawFund(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}
