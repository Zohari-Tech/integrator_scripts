const main = (payload, headers, constants, client) => {
  const {
    MSISDN,
    accountNumber,
    transactionId,
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
    requeststring: "",
    headers: headers,
  };
};