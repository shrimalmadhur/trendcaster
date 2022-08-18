import { FC, useContext, useEffect, useRef, useState } from 'react';
import axios from "axios";
import React from 'react'
import { init, useConnectWallet } from '@web3-onboard/react'
import injectedModule from '@web3-onboard/injected-wallets'
import { ethers } from 'ethers'

const rpcUrl = process.env.NEXT_PUBLIC_ALCHEMY_URL || ""

const injected = injectedModule();

// initialize Onboard
init({
    wallets: [injected],
    chains: [
        {
            id: '0x4',
            token: 'ETH',
            label: 'Ethereum Rinkeby',
            rpcUrl
        }
    ],
    appMetadata: {
        name: "Trendcaster",
        icon: '<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 60 60" style="enable-background:new 0 0 60 60;" xml:space="preserve"><g><rect x="32" y="7" style="fill:#14A085;" width="10" height="45"/><rect x="17" y="38" style="fill:#F29C1F;" width="10" height="14"/><rect x="2" y="29" style="fill:#E57E25;" width="10" height="23"/><rect x="47" y="15" style="fill:#71C285;" width="10" height="37"/><path style="fill:#556080;" d="M59,53H1c-0.552,0-1-0.447-1-1s0.448-1,1-1h58c0.552,0,1,0.447,1,1S59.552,53,59,53z"/></g></svg>',
        description: "Trends on Farcaster"
    }
})

const defaultData = {
    username: "",
    count: "loading...",
    farcasterAddress: "0x00",
    recastCount: "loading...",
    firstCastCounnt: "loading..."
}

const ProfileDetails: FC = () => {

    const [{ wallet, connecting }, connect, disconnect] = useConnectWallet()
    const [username, setUsername] = useState()
    const [profileDetails, setProfileDetails] = useState(defaultData)

    useEffect(() => {
        if (wallet) {
            const connectedAddress = wallet.accounts[0].address;
            axios("/api/searchcaster/" + connectedAddress)
                .then((response) => {
                    console.log(response);
                    setUsername(response.data);
                })
        }
    }, [wallet])

    useEffect(() => {
        if (username) {
            axios("/api/v1/" + username)
                .then((response) => {
                    setProfileDetails(response.data)
                })
        }
    }, [username])

    // create an ethers provider
    let ethersProvider

    if (wallet) {
        ethersProvider = new ethers.providers.Web3Provider(wallet.provider, 'any')
    }

    return (
        <div className='flex flex-col mx-auto mb-6'>
            <div className="flex mx-auto">
                <button className="mt-4 px-2 w-32 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    disabled={connecting}
                    onClick={() => (wallet ? disconnect(wallet) : connect())}
                >
                    {connecting ? 'Connecting' : wallet ? 'Disconnect' : 'Connect Wallet'}
                </button>
            </div>

            {wallet ?
                <div className="flex flex-col">
                    <div className="pl-10 pt-10 text-3xl font-mono">@{username}</div>
                    <div className="pl-10 pt-10 text-2xl font-mono">Farcaster address: {profileDetails.farcasterAddress}</div>
                    <div className="pl-10 pt-10 text-2xl font-mono">Total cast: {profileDetails.count}</div>
                    <div className="pl-10 pt-10 text-2xl font-mono">Total recast: {profileDetails.recastCount}</div>
                    <div className="pl-10 text-sm">updated every 24 hrs</div>
                </div>

                : <div className="mt-4 flex text-2xl">Connect your wallet to see personal data</div>}
        </div>
    )
}

export default ProfileDetails