import {
    EthereumClient,
    modalConnectors,
    walletConnectProvider,
} from "@web3modal/ethereum";
import { useWeb3Modal, Web3Modal } from "@web3modal/react";
import { useCallback, useEffect } from "react";
import { configureChains, createClient, useAccount } from "wagmi";
import { arbitrum, mainnet, polygon } from "wagmi/chains";
import { Unity, useUnityContext } from "react-unity-webgl";

const Game = () => {
    const {
        UNSAFE__detachAndUnloadImmediate: detachAndUnloadImmediate,
        unityProvider,
        loadingProgression,
        isLoaded,
        addEventListener,
        removeEventListener,
        sendMessage
    } = useUnityContext({
        loaderUrl: "Shiba/Build/Shiba.loader.js",
        dataUrl: "Shiba/Build/Shiba.data",
        frameworkUrl: "Shiba/Build/Shiba.framework.js",
        codeUrl: "Shiba/Build/Shiba.wasm",
        streamingAssetsUrl: "Shiba/StreamingAssets",
    });
    const chains = [arbitrum, mainnet, polygon];
    const { open } = useWeb3Modal();
    const { provider } = configureChains(chains, [
        walletConnectProvider({ projectId: "8d6445f6a0eca8324853158ac3778024" }),
    ]);
    const wagmiClient = createClient({
        autoConnect: true,
        connectors: modalConnectors({ appName: "web3Modal", chains }),
        provider,
    });
    const { address } = useAccount()
    const ethereumClient = new EthereumClient(wagmiClient, chains);

    const connectWallet = useCallback(() => {
        if (!address)
            open();
        else {
            sendMessage("ConnectWalletController", "SetWalletAddress", address + "");
        }
    }, [address, sendMessage, open]);
    useEffect(() => {
        addEventListener("ConnectWallet", connectWallet);
        return () => {
            removeEventListener("ConnectWallet", connectWallet);
        }
    }, [connectWallet, addEventListener, removeEventListener])

    useEffect(() => {
        return () => {
            try {
                detachAndUnloadImmediate();
            } catch { }
        };
    }, [detachAndUnloadImmediate]);
    return (
        <>
            {!isLoaded && (
                <p>Loading Application... {Math.round(loadingProgression * 100)}%</p>
            )}
            <Unity unityProvider={unityProvider} style={{ width: 1280, height: 720 }} />
            <Web3Modal
                projectId="8d6445f6a0eca8324853158ac3778024"
                ethereumClient={ethereumClient}
            />
        </>
    )
}
export default Game;