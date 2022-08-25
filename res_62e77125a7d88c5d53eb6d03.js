const main = (payload, constants) => {
  const { Result, Description, TransactionID } = payload;

  //TODO: Do your transformation for response here
  let finalstatus = "TRX400";

  if (Result === "0") {
    finalstatus = "TRX200";
  }

  return {
    TPCode: `${TransactionID}`, // Code recieved from payment processor
    Code: TransactionID, // Tracking code for internal perposes
    RecievedDate: new Date().toISOString(), // Date response received
    StatusCode: finalstatus, // Final status code as know by our system
    StatusDescription: `${Result}|${Description}`, // Status Description as received from processor
  };
};
