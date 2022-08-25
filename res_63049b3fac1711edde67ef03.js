const main = (payload, constants) => {
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

  // NOTE: To handle payload validation error that get back from the api
  if (!payload.hasOwnProperty("state")) {
    return result("", "", "TRX500", "failed.create", {});
  } else if (payload.state === "transfer.confirm") {
    // NOTE: Handle confirm payment
    return confirmTransfer(payload.code, constants);
  }

  const combinedState = `${state}.${info.state}`;

  // NOTE: Handle the callback events
  switch (combinedState) {
    case "new.unconfirmed":
      finalstatus = "TRX204";
      return result(info.code, reference, finalstatus, combinedState, {
        fee: fees,
        rate: rate,
      });

    case "new.confirmed":
      //NOTE: Do not process the sync response as its callback should come through
      finalstatus = "TRX204";
      return result(info.code, reference, finalstatus, combinedState, {
        fee: fees,
        rate: rate,
      });
    case "payout.pending":
      finalstatus = "TRX200";
      return result(info.code, reference, finalstatus, combinedState, {
        fee: fees,
        rate: rate,
      });
    case "payout.paid":
      finalstatus = "TRX200";
      return result(info.code, reference, finalstatus, combinedState, {
        fee: fees,
        rate: rate,
      });
    case "cancelled.cancelled":
      finalstatus = "TRX400";
      return result(info.code, reference, finalstatus, combinedState, {
        fee: fees,
        rate: rate,
      });
    case "payout.pending":
      finalstatus = "TRX200";
      return result(info.code, reference, finalstatus, combinedState, {
        fee: fees,
        rate: rate,
      });
    case "sent.sent":
      finalstatus = "TRX200";
      return result(info.code, reference, finalstatus, combinedState, {
        fee: fees,
        rate: rate,
      });
    case "held.pending":
      finalstatus = "TRX204";
      return result(info.code, reference, finalstatus, combinedState, {
        fee: fees,
        rate: rate,
      });
    case "finished.paid":
      finalstatus = "TRX200";
      return result(info.code, reference, finalstatus, combinedState, {
        fee: fees,
        rate: rate,
      });
    case "review.reviewing":
      finalstatus = "TRX204";
      return result(info.code, reference, finalstatus, combinedState, {
        fee: fees,
        rate: rate,
      });
    default:
      finalstatus = "TRX500";
      return result(info.code, reference, finalstatus, combinedState, {
        fee: fees,
        rate: rate,
      });
  }
};

const result = (TPCode, reference, statusCode, combinedState, metadata) => {
  const codes = reference.split("|");
  metadata["TransactionID"] = codes[0];

  //NOTE: if the split dint happen in 2 use the normal tp recieved
  const finalcode = codes.length === 2 ? codes[1] : reference;
  return {
    TPCode: TPCode, // Code recieved from payment processor
    Code: finalcode, // Tracking code for internal perposes
    RecievedDate: new Date().toISOString(), // Date response received
    StatusCode: statusCode, // Final status code as know by our system
    StatusDescription: combinedState, // Status Description as received from processor
    metadata: metadata, // extra data about the request
  };
};

const confirmTransfer = (code, constants) => {
  const header = {
    Authorization: [
      `Basic ${btoa(constants.username + ":" + constants.password)}`,
    ],
  };

  const response = send(
    "",
    `${constants.CONFIRM_URL + code}/confirm`,
    JSON.stringify(header),
    constants.CONFIRM_HTTP_METHOD
  );

  if (!response.hasOwnProperty("state")) {
    return result(
      "",
      code,
      "TRX400",
      "failed.confirmation",
      JSON.parse(response)
    );
  } else if (`${response.state}.${response.info.state}` === "new.confirmed") {
    // Failed to confirm
    return result(
      response.info.code,
      response.reference,
      "TRX204",
      `${response.state}.${response.info.state}`,
      {
        fee: response.fees,
        rate: response.rate,
      }
    );
  } else {
    return result(
      response.info.code,
      response.reference,
      "TRX400",
      `${response.state}.${response.info.state}`,
      response.info
    );
  }
};
