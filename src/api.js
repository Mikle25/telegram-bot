import axios from "axios";

export const getCurrentExchange = async (pair) => {
    const resp = await axios.get(`https://api.binance.com/api/v3/ticker/price?symbol=${pair}`)

    return resp.data;
}