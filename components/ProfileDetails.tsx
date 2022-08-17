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
    ]
  })

const ProfileDetails: FC = () => {

    const [{ wallet, connecting }, connect, disconnect] = useConnectWallet()

    // create an ethers provider
    let ethersProvider

    if (wallet) {
        ethersProvider = new ethers.providers.Web3Provider(wallet.provider, 'any')
    }

    return (
        <div>
      <button
            disabled={connecting}
            onClick={() => (wallet ? disconnect(wallet) : connect())}
        >
            {connecting ? 'connecting' : wallet ? 'disconnect' : 'connect'}
        </button>
        </div>
    )
}

export default ProfileDetails