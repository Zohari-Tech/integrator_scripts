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

  // NOTE: Usefull in cancel, confirm and get transfer requests
  const header = {
    Authorization: [
      `Basic ${btoa(constants.username + ":" + constants.password)}`,
    ],
  };

  // NOTE: To handle payload validation error that get back from the api
  if (!payload.hasOwnProperty("state")) {
    return result("", "", "TRX500", "failed.create", {});
  }

  // NOTE: Check if single state or not if single state client is Initiating client else processing client
  const combinedState = payload.hasOwnProperty("info")
    ? `${state}.${info.state}`
    : state;

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
    // All statuses that have tranfer.* are based on
    // NOTE: initiator client
    // the rest are based on processor client
    case "transfer.confirm":
      const confirm_url = `${constants.BASE_URL + payload.code}/confirm`;
      return confirmStatusProcess(confirm_url, header, "POST");
    case "transfer.query":
      const query_url = constants.BASE_URL + payload.code;
      return confirmStatusProcess(query_url, header, "GET");
    case "transfer.cancel":
      const cancel_url = `${constants.BASE_URL + payload.code}/cancel`;
      return confirmStatusProcess(cancel_url, header, "POST");
    default:
      finalstatus = "TRX500";
      return result(info.code, reference, finalstatus, combinedState, {
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

// NOTE: Handle all initiator client requests to processor
const confirmStatusProcess = (url, header, method) => {
  const response = JSON.parse(send("", url, JSON.stringify(header), method));
  if (!response.hasOwnProperty("state")) {
    return result("", code, "TRX400", "failed.statecheck", response);
  } else if (
    `${response.state}.${response.info.state}` === "new.confirmed" ||
    `${response.state}.${response.info.state}` === "new.unconfirmed"
  ) {
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
  } else if (`${response.state}.${response.info.state}` === "payout.pending") {
    return result(
      response.info.code,
      response.reference,
      "TRX200",
      `${response.state}.${response.info.state}`,
      response.info
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
