const main = (payload, headers, constants, client) => {
  const {
    MSISDN,
    accountNumber,
    Code,
    amount,
    currentDate,
    narration,
    ISOCurrencyCode,
    customerName,
    paymentMode,
    callback,
    metadata,
  } = payload;
  // Check client config first before
  // TODO: //Put your transformation code here
  return {
    payload: "",
    headers: headers,
  };
};