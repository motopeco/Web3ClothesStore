'use client'

import { useEffect, useState } from 'react'
import { MetaMaskInpageProvider } from '@metamask/providers'

type Asset = {
  image_url: string
}

type OutputAssetQuery = {
  assets: Asset[]
}

export default function Store() {
  const [walletID, setWalletID] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [url, setURL] = useState('')
  const [imageURL, setImageURL] = useState('')

  useEffect(() => {
    void (async () => {
      const { ethereum } = window as unknown as { ethereum: MetaMaskInpageProvider }
      const data = await ethereum.request({ method: 'eth_requestAccounts' })
      const wallet = (data as string[])[0]
      setWalletID(wallet)
    })()
  }, [])

  const handleCheck = async () => {
    setErrorMessage('')
    console.log(url)

    const matches = url.match('^https://.*(0x[0-9a-zA-Z]+)\\/([0-9]+)$')
    if (!matches) {
      setErrorMessage('正しいURLを入力してください')
      return
    }

    if (matches.length < 3) {
      setErrorMessage('正しいURLを入力してください')
      return
    }

    const query = new URLSearchParams({
      owner: walletID,
      token_ids: matches[2],
      order_direction: 'desc',
      offset: '0',
      limit: '1',
      include_orders: 'false'
    } as any)

    const resp = await fetch(`https://testnets-api.opensea.io/api/v1/assets?${query}`)
    const data: OutputAssetQuery = await resp.json()
    if (data.assets.length < 1) {
      alert('NFTが見つからないか、所有者ではありません')
      return
    }

    const asset = data.assets[0]
    setImageURL(asset.image_url)
  }

  return (
    <div style={{ height: '100vh' }} className="flex">
      <div className="rounded py-10 border-2 m-auto top-0 bottom-0 px-10">
        <div className="text-center text-xl mb-5">所有者チェック（所有者の場合、ボタンを押した後でNFTの画像が表示されます）</div>
        <div>WalletID [<b>{walletID}</b>]</div>

        <div className="mt-5">
          <label htmlFor="input-url">OpenSea AssetURL</label>
          <input onChange={e => setURL(e.target.value)} id="input-url" className="mt-2 w-full p-2 bg-slate-200 rounded-xl" type="text" placeholder="https://opensea.io/ja/assets/ethereum/0x000/12345" />
          <div className="text-red-600">{errorMessage}</div>
        </div>
        <div className="mt-5">
          {
            imageURL !== '' ? (
              <img src={imageURL} alt=""/>
            ) : null
          }
        </div>
        <div className="mt-8">
          <button onClick={handleCheck} className="bg-emerald-400 w-full text-white p-1 rounded-xl">所有者チェック</button>
        </div>
      </div>
    </div>
  )
}
