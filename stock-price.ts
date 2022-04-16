import fetch from 'node-fetch';

/**
 * Find Stock ticker highest price
 * @param  {string} ticker
 */
export async function findTickerHighestPrice (ticker: string) { 
  let highestPrice = 0;
  let priceTime: string
  let response  = await getIntraDayStockData(ticker)
  delete response['Meta Data'] //remove meta data
  const timeSeries = Object.values(response)[0]
  Object.keys(timeSeries).forEach(key => {
    const prices = timeSeries[key]
    const highPrice = prices['2. high']
    if (Number(highPrice) > highestPrice) {
        highestPrice = highPrice
        priceTime = `${key}`
    }
  })
 console.log(`${priceTime}: ${highestPrice}`)
  return {priceTime, highestPrice}
}

/**
 * Get Intra day stock data
 * @param  {string} ticker
 */
async function getIntraDayStockData(ticker: string) {
  try {
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${ticker}&interval=60min&slice=year1month1&apikey=CGOM2DHNFNWFT4YM`
    
const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`Error! status: ${response.status}`);
    }
    const result = await response.json();
    return result;
  } catch (error) {
    if (error instanceof Error) {
      console.log('error message: ', error.message);
      return error.message;
    } else {
      console.log('unexpected error: ', error);
      return 'An unexpected error occurred';
    }
  }
}
