import axios from 'axios'

export const getCurrentExchange = async (pair) => {
  try {
    const resp = await axios.get(
      `https://api.binance.com/api/v3/ticker/price?symbol=${pair}`
    )

    return resp.data
  } catch (e) {
    console.log(e.message)
  }
}

export const binanceP2P = async () => {
  try {
    const resp = await axios.post(
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
        },
      }
    )

    return resp.data.data
  } catch (e) {
    console.log(e.message)
  }
}
