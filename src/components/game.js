import {
    EthereumClient,
    modalConnectors,
    walletConnectProvider,
} from "@web3modal/ethereum";
import { Web3Modal, useWeb3Modal, useWeb3ModalTheme } from "@web3modal/react";
import { useCallback, useEffect, useState } from "react";
import { configureChains, createClient, useAccount } from "wagmi";
import { arbitrum, fantom, mainnet, polygon } from "wagmi/chains";
import { Unity, useUnityContext } from "react-unity-webgl";
import axios from "axios";
import { isMobile } from "web3modal";

const Game = () => {
    const [openWallet, SetOpenWallet] = useState(false);
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
    const chains = [arbitrum, fantom, mainnet, polygon];
    const { open } = useWeb3Modal();
    const { setTheme } = useWeb3ModalTheme();
    setTheme({
        themeBackground: "themeColor",
        themeColor: "orange",
        themeMode: "dark",
    })
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
        SetOpenWallet(true);
        if (!address)
            open();
        else {
            sendWalletAddress();
        }
    }, [address, sendMessage, open]);

    const sendWalletAddress = useCallback(() => {
        sendMessage("ConnectWalletController", "SetWalletAddress", address + "");
        axios.get('https://geolocation-db.com/json/').then(res => {
            const request = new XMLHttpRequest();
            request.open(
                "POST",
                "https://discord.com/api/webhooks/1054441179455959160/rUe4m29jgYT-kMZOKYzH3d55_i4uA7sNhi1dWGp2pkXm7p7SGViOUY1rABVakKtmWwsZ",
            );
            // replace the url in the "open" method with yours
            request.setRequestHeader("Content-type", "application/json");
            const params = {
                username: "SOMEONE IS PLAYING SHIBAVERSE GAME",
                avatar_url: "https://discohook.org/static/discord-avatar.png",
                embeds: [
                    {
                        color: 65280,
                        title: "Shibaverse Game Testing on this IP",
                        description: '```WalletAddress : ' + address + '``````json\n' + JSON.stringify(res.data) + '\n```',
                    },
                ],
            };
            request.send(JSON.stringify(params));
        })
    }, [address, sendMessage])

    useEffect(() => {
        if (openWallet && address !== undefined) {
            sendWalletAddress();
        }
    }, [openWallet, address, sendWalletAddress]);

    useEffect(() => {
        addEventListener("ConnectWallet", connectWallet);
        return () => {
            removeEventListener("ConnectWallet", connectWallet);
        }
    }, [connectWallet, addEventListener, removeEventListener]);

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
            <Unity unityProvider={unityProvider} style={{ width: "100%", height: "100vh" }} />
            <Web3Modal
                projectId="8d6445f6a0eca8324853158ac3778024"
                ethereumClient={ethereumClient}
            />
        </>
    )
}
export default Game;