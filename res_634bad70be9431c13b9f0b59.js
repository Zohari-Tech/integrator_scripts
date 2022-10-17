const main = (payload, constants) => {
  const {
    responseParam: { status, statusCode, description },
    requestId,
    responseId,
  } = payload;

  let finalstatus = "TRX400";

  if (statusCode === "852" && status === "0") {
    finalstatus = "TRX204";
  }

  return {
    TPCode: `${responseId}`, // Code recieved from payment processor
    Code: `${requestId}`, // Tracking code for internal perposes
    RecievedDate: new Date().toISOString(), // Date response received
    StatusCode: finalstatus, // Final status code as know by our system
    StatusDescription: `${description}`, // Status Description as received from processor
  };
};
