export const convertUSDTToMatic = (
  amountInUSDT: number,
  maticPrice: number,
  usdtPrice: number,
) => {
  // If any price data is missing, return null
  if (maticPrice === null || usdtPrice === null || amountInUSDT === null) {
    return null;
  }

  // Convert USDT to Matic based on prices
  const amountInMatic = amountInUSDT * (usdtPrice / maticPrice);

  return amountInMatic;
};
