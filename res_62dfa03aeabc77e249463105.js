const main = (payload, constants) => {
  if (payload.hasOwnProperty("Body")) {
    return FinalCallback(payload);
  }
  return AcknowledgementStatus(payload);
};

const FinalCallback = (payload) => {
  const {
    Body: {
      stkCallback: {
        MerchantRequestID,

        ResultCode,
        ResultDesc,
      },
    },
  } = payload;

  let finalstatus = "TRX400";
  if (ResultCode == "0") {
    finalstatus = "TRX200";
  }
  const Code = searchTrx("TPCODE", `${MerchantRequestID}`);
  log(Code);

  return {
    TPCode: `${MerchantRequestID}`, // Code recieved from payment processor
    Code: Code, // Tracking code for internal perposes
    RecievedDate: new Date().toISOString(), // Date response received
    StatusCode: finalstatus, // Final status code as know by our system
    StatusDescription: `${ResultCode}|${ResultDesc}`, // Status Description as received from processor
  };
};

const AcknowledgementStatus = (payload) => {
  const { MerchantRequestID, ResponseCode, ResponseDescription } = payload;

  let finalstatus = "TRX400";

  if (ResponseCode === "0") {
    finalstatus = "TRX204";
  }

  return {
    TPCode: `${MerchantRequestID}`, // Code recieved from payment processor
    Code: "", // Tracking code for internal perposes
    RecievedDate: new Date().toISOString(), // Date response received
    StatusCode: finalstatus, // Final status code as know by our system
    StatusDescription: `${ResponseCode}|${ResponseDescription}`, // Status Description as received from processor
  };
};
