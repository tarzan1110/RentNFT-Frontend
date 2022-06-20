import Web3 from "web3"
import ERC20ABI from "./ERC20.abi.json"

// "0x2a4EB6BD666040C96f8bf6e5032E0d5B76B9D6E8" //
// "7fa5b9e78ec896d1169433d43e03d6ce1bac5770c9fa64277c7dfd8998bf5798" //
export const SYSTEM_ADDR = "0x4CeAfbd5665b1E395E5654686a0bF4d46Bc1c770"
export const SYSTEM_PK = "77b8500ea75b6e5e18d32644644147de0f857f0a5091150c3fcf25f43b7760b2"

export const ABI: any[] = [{ "inputs": [{ "internalType": "address", "name": "_resolver", "type": "address" }, { "internalType": "address payable", "name": "_beneficiary", "type": "address" }, { "internalType": "address", "name": "_admin", "type": "address" }], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "uint256", "name": "lendingId", "type": "uint256" }, { "indexed": false, "internalType": "uint32", "name": "claimedAt", "type": "uint32" }], "name": "CollateralClaimed", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "uint256", "name": "lendingId", "type": "uint256" }, { "indexed": false, "internalType": "uint32", "name": "stoppedAt", "type": "uint32" }], "name": "LendingStopped", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "nftAddress", "type": "address" }, { "indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256" }, { "indexed": false, "internalType": "uint8", "name": "lentAmount", "type": "uint8" }, { "indexed": false, "internalType": "uint256", "name": "lendingId", "type": "uint256" }, { "indexed": true, "internalType": "address", "name": "lenderAddress", "type": "address" }, { "indexed": false, "internalType": "uint8", "name": "maxRentDuration", "type": "uint8" }, { "indexed": false, "internalType": "bytes4", "name": "dailyRentPrice", "type": "bytes4" }, { "indexed": false, "internalType": "bytes4", "name": "nftPrice", "type": "bytes4" }, { "indexed": false, "internalType": "bool", "name": "isERC721", "type": "bool" }, { "indexed": false, "internalType": "enum IResolver.PaymentToken", "name": "paymentToken", "type": "uint8" }], "name": "Lent", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "uint256", "name": "lendingId", "type": "uint256" }, { "indexed": true, "internalType": "address", "name": "renterAddress", "type": "address" }, { "indexed": false, "internalType": "uint8", "name": "rentDuration", "type": "uint8" }, { "indexed": false, "internalType": "uint32", "name": "rentedAt", "type": "uint32" }], "name": "Rented", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "uint256", "name": "lendingId", "type": "uint256" }, { "indexed": false, "internalType": "uint32", "name": "returnedAt", "type": "uint32" }], "name": "Returned", "type": "event" }, { "inputs": [{ "internalType": "address[]", "name": "_nfts", "type": "address[]" }, { "internalType": "uint256[]", "name": "_tokenIds", "type": "uint256[]" }, { "internalType": "uint256[]", "name": "_lendingIds", "type": "uint256[]" }], "name": "claimCollateral", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address[]", "name": "_nfts", "type": "address[]" }, { "internalType": "uint256[]", "name": "_tokenIds", "type": "uint256[]" }, { "internalType": "uint256[]", "name": "_lendAmounts", "type": "uint256[]" }, { "internalType": "uint8[]", "name": "_maxRentDurations", "type": "uint8[]" }, { "internalType": "bytes4[]", "name": "_dailyRentPrices", "type": "bytes4[]" }, { "internalType": "bytes4[]", "name": "_nftPrices", "type": "bytes4[]" }, { "internalType": "enum IResolver.PaymentToken[]", "name": "_paymentTokens", "type": "uint8[]" }], "name": "lend", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }, { "internalType": "address", "name": "", "type": "address" }, { "internalType": "uint256[]", "name": "", "type": "uint256[]" }, { "internalType": "uint256[]", "name": "", "type": "uint256[]" }, { "internalType": "bytes", "name": "", "type": "bytes" }], "name": "onERC1155BatchReceived", "outputs": [{ "internalType": "bytes4", "name": "", "type": "bytes4" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }, { "internalType": "address", "name": "", "type": "address" }, { "internalType": "uint256", "name": "", "type": "uint256" }, { "internalType": "uint256", "name": "", "type": "uint256" }, { "internalType": "bytes", "name": "", "type": "bytes" }], "name": "onERC1155Received", "outputs": [{ "internalType": "bytes4", "name": "", "type": "bytes4" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }, { "internalType": "address", "name": "", "type": "address" }, { "internalType": "uint256", "name": "", "type": "uint256" }, { "internalType": "bytes", "name": "", "type": "bytes" }], "name": "onERC721Received", "outputs": [{ "internalType": "bytes4", "name": "", "type": "bytes4" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "paused", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address[]", "name": "_nfts", "type": "address[]" }, { "internalType": "uint256[]", "name": "_tokenIds", "type": "uint256[]" }, { "internalType": "uint256[]", "name": "_lendingIds", "type": "uint256[]" }, { "internalType": "uint8[]", "name": "_rentDurations", "type": "uint8[]" }], "name": "rent", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "rentFee", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address[]", "name": "_nfts", "type": "address[]" }, { "internalType": "uint256[]", "name": "_tokenIds", "type": "uint256[]" }, { "internalType": "uint256[]", "name": "_lendingIds", "type": "uint256[]" }], "name": "returnIt", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address payable", "name": "_newBeneficiary", "type": "address" }], "name": "setBeneficiary", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bool", "name": "_paused", "type": "bool" }], "name": "setPaused", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_rentFee", "type": "uint256" }], "name": "setRentFee", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address[]", "name": "_nfts", "type": "address[]" }, { "internalType": "uint256[]", "name": "_tokenIds", "type": "uint256[]" }, { "internalType": "uint256[]", "name": "_lendingIds", "type": "uint256[]" }], "name": "stopLending", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bytes4", "name": "interfaceId", "type": "bytes4" }], "name": "supportsInterface", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }]

export const NFT_ABI: any[] = [{"inputs":[{"internalType":"address","name":"beacon","type":"address"},{"internalType":"bytes","name":"data","type":"bytes"}],"stateMutability":"payable","type":"constructor"},{"stateMutability":"payable","type":"fallback"},{"stateMutability":"payable","type":"receive"}]

export const ERC721ABI: any[] = [
  {
    "constant": false,
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "approve",
    "outputs": [

    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "mint",
    "outputs": [

    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "safeTransferFrom",
    "outputs": [

    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      },
      {
        "internalType": "bytes",
        "name": "_data",
        "type": "bytes"
      }
    ],
    "name": "safeTransferFrom",
    "outputs": [

    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "bool",
        "name": "approved",
        "type": "bool"
      }
    ],
    "name": "setApprovalForAll",
    "outputs": [

    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "transferFrom",
    "outputs": [

    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [

    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "Transfer",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "approved",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "Approval",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "operator",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "approved",
        "type": "bool"
      }
    ],
    "name": "ApprovalForAll",
    "type": "event"
  },
  {
    "constant": true,
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "getApproved",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "operator",
        "type": "address"
      }
    ],
    "name": "isApprovedForAll",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "ownerOf",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "internalType": "bytes4",
        "name": "interfaceId",
        "type": "bytes4"
      }
    ],
    "name": "supportsInterface",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  }
]

export const Networks = {
  MainNet: 1,
  Ropsten: 3,
  Rinkeby: 4,
  Goerli: 5,
  Kovan: 42,
}

interface IERC20 {
  symbol: string
  address: string
  decimals: number
  name: string
  abi: any
}

export const TOKENS_BY_NETWORK: {
  [key: number]: IERC20[]
} = {
  [Networks.Ropsten]: [
    {
      address: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
      name: "Wrapped Ether",
      symbol: "WETH",
      decimals: 18,
      abi: ERC20ABI,
    },
  ]
}

export const CONTRACT_ADDRESS = "0x17f72fe345424611E5dD6c4952EB972f0dea0f79"

export const WETH_CONTRACT = "0xc778417e063141139fce010982780140aa0cd5ab"

export const ropsNodeURL = "https://ropsten.infura.io/v3/698b5c79e96c4f6294b164f00fe651da"

export const initWeb3 = () => {
  const ropstenProvider = new Web3.providers.HttpProvider(ropsNodeURL)
  return new Web3(ropstenProvider)
}