import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
  WagmiCore,
  WagmiCoreChains,
  WagmiCoreConnectors,
} from "https://unpkg.com/@web3modal/ethereum@2.6.2";

import { Web3Modal } from "https://unpkg.com/@web3modal/html@2.6.2";

// 0. Import wagmi dependencies
const { mainnet, polygon, avalanche, arbitrum, polygonMumbai } =
  WagmiCoreChains;
const {
  configureChains,
  createConfig,
  watchAccount,
  watchNetwork,
  getWalletClient,
  disconnect,
} = WagmiCore;

// 1. Define chains
const chains = [mainnet, polygon, avalanche, arbitrum, polygonMumbai];
const projectId = "0a071adf271ae2a7936b4eeccdec6935";

// 2. Configure wagmi client
const { publicClient } = configureChains(chains, [w3mProvider({ projectId })]);
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: [
    ...w3mConnectors({ chains, version: 2, projectId }),
    new WagmiCoreConnectors.CoinbaseWalletConnector({
      chains,
      options: {
        appName: "html wagmi example",
      },
    }),
  ],
  publicClient,
});

// 3. Create ethereum and modal clients
const ethereumClient = new EthereumClient(wagmiConfig, chains);
export const web3Modal = new Web3Modal(
  {
    projectId,
    themeVariables: {
      "--w3m-accent-color": "#06071b",
      "--w3m-background-color": "#06071b",
    },
    walletImages: {
      safe: "https://pbs.twimg.com/profile_images/1566773491764023297/IvmCdGnM_400x400.jpg",
    },
  },
  ethereumClient
);

function signIn() {
  web3Modal.openModal();
}

const connectButton = document.getElementById("connect-wallet-btn");
if (connectButton) {
  connectButton.addEventListener("click", signIn);
}

watchAccount((account) => {
  console.log(account);
  if (account.address) {
    document.cookie = `account=${account.address}; path=/;`;
  } else {
    document.cookie = `account=; path=/;`;
  }
});

watchNetwork((network) => {
  console.log(network);
  if (network.chain) {
    document.cookie = `chainId=${network.chain.id}; path=/;`;
  } else {
    document.cookie = `chainId=; path=/;`;
  }
});

window.ethereum.on("accountsChanged", async (accounts) => {
  if (accounts.length === 0) {
    await disconnect();
  } else if (accounts.length > 0) {
  }
});
