import { MichelsonV1Expression } from "@taquito/rpc";
import { TransferParams } from "@taquito/taquito";
import { Address, ContractAddress, ImplicitAddress } from "./Address";

export type TezOperation = {
  type: "tez";
  recipient: Address;
  amount: string; // TODO: enforce mutez format here
  parameter?: TransferParams["parameter"];
};

export type FA2Operation = {
  type: "fa2";
  sender: Address;
  recipient: Address;
  contract: ContractAddress;
  tokenId: string;
  amount: string;
};

export type FA12Operation = Omit<FA2Operation, "type" | "tokenId"> & {
  type: "fa1.2";
  tokenId: "0";
};

export type Delegation = {
  type: "delegation";
  sender: Address;
  recipient: ImplicitAddress;
};

export type Undelegation = {
  type: "undelegation";
  sender: Address;
};

export type ContractOrigination = {
  type: "contract_origination";
  sender: Address;
  code: MichelsonV1Expression[];
  storage: any;
};

export type Operation =
  | TezOperation
  | FA12Operation
  | FA2Operation
  | Delegation
  | Undelegation
  | ContractOrigination;

export type OperationWithFee = Operation & { fee: string };
