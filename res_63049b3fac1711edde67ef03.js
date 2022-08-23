const main = (payload) => {
  const {
    created,
    destination,
    destination_amount,
    fee,
    fees,
    info,
    rate,
    reference,
    source,
    source_amount,
    state,
    updated,
  } = payload;

  let finalstatus = "TRX204";

  //TODO: Do your transformation for response here

  return {
    TPCode: `${info.code}`, // Code recieved from payment processor
    Code: reference, // Tracking code for internal perposes
    RecievedDate: new Date().toISOString(), // Date response received
    StatusCode: finalstatus, // Final status code as know by our system
    StatusDescription: `${state}|${info.state}`, // Status Description as received from processor
    metadata: {
      fee: fees,
      rate: rate,
    },
  };
};
