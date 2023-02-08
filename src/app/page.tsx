'use client'
import detectEthereumProvider from '@metamask/detect-provider'
import { MetaMaskInpageProvider } from '@metamask/providers'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  const handleClick = async () => {
    const provider = await detectEthereumProvider()
    console.log(provider)
    if (!provider) return

    const { ethereum } = window as unknown as { ethereum: MetaMaskInpageProvider }
    await ethereum.request({ method: 'eth_requestAccounts' })
    router.push('/store')
  }

  useEffect(() => {
    const { ethereum } = window as unknown as { ethereum: MetaMaskInpageProvider }
    ethereum.isConnected()
    router.push('/store')
  }, [])

  return (
    <div style={{ height: '100vh' }} className="flex">
      <div className="rounded py-10 border-2 m-auto top-0 bottom-0 px-10">
        <div className="text-center text-xl mb-5">Walletに接続してください</div>
        <div>
          <button onClick={handleClick} className="bg-emerald-400 w-full text-white p-1 rounded-xl">MetaMaskと接続</button>
        </div>
      </div>
    </div>
  )
}
