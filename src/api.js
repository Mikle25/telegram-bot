import axios from 'axios'
import https from 'https'

const httpsAgent = new https.Agent({ keepAlive: true })

const axiosInstance = axios.create({
  httpsAgent,
  headers: {
    'Cache-Control': 'no-cache',
    'Content-Type': 'application/json',
    'User-Agent': 'Mozilla/5.0',
  },
})

export const getCurrentExchange = async (pair) => {
  try {
    const resp = await axiosInstance.get(
      `https://api.binance.com/api/v3/ticker/price?symbol=${pair}`
    )

    return resp.data
  } catch (e) {
    console.log(e.message)
  }
}

export const binanceP2P = async () => {
  try {
    const resp = await axiosInstance.post(
      'https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search',
      {
        proMerchantAds: false,
        page: 1,
        rows: 5,
        payTypes: ['Monobank'],
        countries: [],
        publisherType: null,
        tradeType: 'SELL',
        asset: 'USDT',
        fiat: 'UAH',
      },
      {
        headers: {
          'Cache-Control': 'no-cache',
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/115.0.0.0 Safari/537.36',
        }
      }
    )

    return resp.data.data
  } catch (e) {
    console.log(e.message)
  }
}
