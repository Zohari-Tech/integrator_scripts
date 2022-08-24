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

  let finalstatus = "TR400";

  const combinedState = `${info.state}.${state}`;

  // NOTE: To handle payload validation error that get back from the api
  if (!payload.hasOwnProperty("state")) {
    return result("", "", "", "failed.create", {});
  } else if (state === "transfer.confirm") {
    // NOTE: Handle confirm payment
    return confirmTransfer(code, payload.constants);
  }

  // NOTE: Handle the callback events
  switch (combinedState) {
    case "new.unconfirmed":
      finalstatus - "TRX204";
      return result(info.Code, reference, finalstatus, combinedState, {
        fee: fees,
        rate: rate,
      });

    case "new.confirmed":
      //NOTE: Do not process the sync response as its callback should come through
      finalstatus - "TRX204";
      return result(info.Code, reference, finalstatus, combinedState, {
        fee: fees,
        rate: rate,
      });
    case "payout.pending":
      finalstatus - "TRX200";
      return result(info.Code, reference, finalstatus, combinedState, {
        fee: fees,
        rate: rate,
      });
    case "payout.paid":
      finalstatus - "TRX200";
      return result(info.Code, reference, finalstatus, combinedState, {
        fee: fees,
        rate: rate,
      });
    case "cancelled.cancelled":
      finalstatus - "TRX400";
      return result(info.Code, reference, finalstatus, combinedState, {
        fee: fees,
        rate: rate,
      });
    case "payout.pending":
      finalstatus - "TRX200";
      return result(info.Code, reference, finalstatus, combinedState, {
        fee: fees,
        rate: rate,
      });
    case "sent.sent":
      finalstatus - "TRX200";
      return result(info.Code, reference, finalstatus, combinedState, {
        fee: fees,
        rate: rate,
      });
    case "held.pending":
      finalstatus - "TRX204";
      return result(info.Code, reference, finalstatus, combinedState, {
        fee: fees,
        rate: rate,
      });
    case "finished.paid":
      finalstatus - "TRX200";
      return result(info.Code, reference, finalstatus, combinedState, {
        fee: fees,
        rate: rate,
      });
    case "review.reviewing":
      finalstatus - "TRX204";
      return result(info.Code, reference, finalstatus, combinedState, {
        fee: fees,
        rate: rate,
      });
    default:
      finalstatus - "TRX500";
      return result(info.Code, reference, finalstatus, combinedState, {
        fee: fees,
        rate: rate,
      });
  }
};

const result = (TPCode, reference, statusCode, combinedState, metadata) => {
  return {
    TPCode: TPCode, // Code recieved from payment processor
    Code: reference, // Tracking code for internal perposes
    RecievedDate: new Date().toISOString(), // Date response received
    StatusCode: statusCode, // Final status code as know by our system
    StatusDescription: combinedState, // Status Description as received from processor
    metadata: metadata, // extra data about the request
  };
};


const confirmTransfer = (code, constants) => {
  // TODO: Search for the transfer
  // Get the transd

  const header = {
    Authorization: [
      `Basic ${btoa(constants.USERNAME + ":" + constants.PASSWORD)}`,
    ],
  };

  const response = send(
    "",
    `${constants.CONF_URL + code}`,
    JSON.stringify(header),
    "GET"
  );
};
