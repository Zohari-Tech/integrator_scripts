const main = (payload, constants) => {
  const { Result, Description, TransactionID } = payload;

  //TODO: Do your transformation for response here
  return {
    transactionId: TransactionID,
    statusId: Result,
    date: "",
    statusCode: 0,
    statusDescription: Description,
    metadata: {},
  };
};
