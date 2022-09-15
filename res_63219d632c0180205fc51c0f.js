const main = (payload, constants) => {
  const query_code = payload["query_code"];

  delete payload["query_code"];
  let finalstatus = "TR400";

  // NOTE: Usefull in cancel, confirm and get transfer requests
  const header = {
    Authorization: [
      `Basic ${btoa(constants.username + ":" + constants.password)}`,
    ],
  };

  const response = send(
    JSON.stringify(payload),
    constants.BASE_URL,
    JSON.stringify(header),
    "POST"
  );

  // FIXME: Authorized caching within the system
  const data = JSON.parse(response);

  // NOTE: Return token error
  if (!response) {
    return result(query_code, "0000000", finalstatus, "Failed", {});
  }

  return result(query_code, "000000", "TRX200", "Success", {
    data: data,
  });
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
