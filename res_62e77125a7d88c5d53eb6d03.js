const main = (payload) => {
  const { Result, Description, TransactionID } = payload;

  //TODO: Do your transformation for response here
  return {
    transactionId: TransactionID,
    statusId: Result,
    date: new Date().toISOString(),
    statusCode: 0,
    statusDescription: Description,
    metadata: {},
  };
};
