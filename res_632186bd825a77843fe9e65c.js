const main = (payload, constants) => {
  const { get_code, country_code } = payload;
  let finalstatus = "TR400";

  // NOTE: Usefull in cancel, confirm and get transfer requests
  const header = {
    Authorization: [
      `Basic ${btoa(constants.username + ":" + constants.password)}`,
    ],
  };

  const response = send(
    "",
    `${constants.BASE_URL + country_code}/banks`,
    JSON.stringify(header),
    "GET"
  );

  // TODO: Authorized caching within the system
  const banks = JSON.parse(response);

  // NOTE: Return token error
  if (!response) {
    return result(get_code, "00000", finalstatus, "Failed", {});
  }

  return result(get_code, "00000", "TRX200", "Success", { banks: banks });
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
