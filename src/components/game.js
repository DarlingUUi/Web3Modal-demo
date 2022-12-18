import {
    EthereumClient,
    modalConnectors,
    walletConnectProvider,
} from "@web3modal/ethereum";
import { useWeb3Modal, Web3Modal } from "@web3modal/react";
import { useEffect } from "react";
import { configureChains, createClient, useAccount } from "wagmi";
import { arbitrum, mainnet, polygon } from "wagmi/chains";

const Game = () => {
    const { address } = useAccount()
    const chains = [arbitrum, mainnet, polygon];
    const { open } = useWeb3Modal();
    // Wagmi client
    const { provider } = configureChains(chains, [
        walletConnectProvider({ projectId: "8d6445f6a0eca8324853158ac3778024" }),
    ]);
    const wagmiClient = createClient({
        autoConnect: true,
        connectors: modalConnectors({ appName: "web3Modal", chains }),
        provider,
    });
    // Web3Modal Ethereum Client
    const ethereumClient = new EthereumClient(wagmiClient, chains);
    useEffect(() => {
        console.log(address)
    })
    return (
        <>
            {
                address ? <p>{address}</p> : <button onClick={open}>Connect To Metamask Wallet</button>
            }
            <Web3Modal
                projectId="8d6445f6a0eca8324853158ac3778024"
                ethereumClient={ethereumClient}
            />
        </>
    )
}
export default Game;