import { BIT } from "./config";
import Web3 from "web3";

export async function getSymbol(_address) {
  return new new Web3(window.ethereum).eth.Contract(BIT.abi, _address).methods
    .symbol()
    .call();
}
