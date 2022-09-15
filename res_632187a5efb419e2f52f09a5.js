const main = (payload, constants) => {
  const { get_code, country_code, bank_code } = payload;
  let finalstatus = "TR400";

  // NOTE: Usefull in cancel, confirm and get transfer requests
  const header = {
    Authorization: [
      `Basic ${btoa(constants.username + ":" + constants.password)}`,
    ],
  };

  const response = send(
    "",
    `${constants.BASE_URL + country_code}/banks/${bank_code}/branches`,
    JSON.stringify(header),
    "GET"
  );

  // FIXME: Authorized caching within the system
  const branches = JSON.parse(response);

  // NOTE: Return token error
  if (!response) {
    return result(get_code, "0000000", finalstatus, "Failed", {});
  }

  return result(get_code, "000000", "TRX200", "Success", {
    branches: branches,
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
