const main = (payload, constants) => {
  const { TOKEN_URL, USERNAME, PASSWORD, MAIN_URL, PARTNER_CODE } = constants;
  const { productcode, msisdn, requestId } = payload;

  const auth_headers = {
    "Content-Type": [`application/json`],
    Accept: [`application/json`],
    "X-Requested-With": ["XMLHttpRequest"],
  };
  const auth_body = {
    username: USERNAME,
    password: PASSWORD,
  };
  const response = send(
    JSON.stringify(auth_body),
    TOKEN_URL,
    JSON.stringify(auth_headers),
    "POST"
  );

  if (!response) {
    return {
      payload: "",
      headers: headers,
      error: "Empty response",
    };
  }

  const response_object = JSON.parse(response);
  if (response_object.hasOwnProperty("errorCode")) {
    return {
      payload: "",
      headers: headers,
      error: response_object.message,
    };
  }

  const main_headers = {
    "Content-Type": [`application/json`],
    Accept: [`application/json`],
    // "X-Requested-With": ["XMLHttpRequest"],
    "X-Authorization": [`Bearer ${response_object.token}`],
  };

  const main_payload = {
    requestId: requestId,
    requestTimeStamp: "",
    channel: "APIGW",
    requestParam: {
      data: [
        {
          name: "OfferCode",
          value: productcode,
        },
        {
          name: "Msisdn",
          value: msisdn,
        },
        {
          name: "Language",
          value: "1",
        },
        {
          name: "CpId",
          value: PARTNER_CODE,
        },
      ],
    },
    operation: "ACTIVATE",
  };

  const main_response = send(
    JSON.stringify(main_payload),
    MAIN_URL,
    JSON.stringify(main_headers),
    "POST"
  );

  if (!main_response) {
    return {
      payload: "",
      headers: headers,
      error: "Empty response",
    };
  }

  let finalstatus = "TRX400";

  if (main_response.responseParam.statusCode === "112") {
    finalstatus = "TRX204";
  }

  return {
    TPCode: `${main_response.responseId}`, // Code recieved from payment processor requestId
    Code: `${requestId}`, // Tracking code for internal perposes
    RecievedDate: new Date().toISOString(), // Date response received
    StatusCode: finalstatus, // Final status code as know by our system
    StatusDescription: `${main_response.responseParam.description}`, // Status Description as received from processor
  };
};
