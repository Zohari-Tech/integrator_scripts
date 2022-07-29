const main = (payload) => {
  const {
    MerchantRequestID,
    CheckoutRequestID,
    ResponseCode,
    ResponseDescription,
    CustomerMessage,
  } = payload;

  return {
    transactionId: MerchantRequestID,
    trackingId: CheckoutRequestID,
    date: new Date().toISOString(),
    statusCode: ResponseCode,
    statusDescription: ResponseDescription,
    metadata: {},
  };
};
