const main = (payload, headers, constants, client, url) => {
  const { MSISDN, accountNumber, Code, amount } = payload;

  const { TOKEN_URL, USERNAME, PASSWORD, PARTNER_CODE } = constants;

  const auth_headers = {
    "Content-Type": [`application/json`],
    Accept: [`application/json`],
    "X-Requested-With": ["XMLHttpRequest"],
  };
  const auth_body = {
    password: PASSWORD,
    username: USERNAME,
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
  headers["X-Authorization"] = [`Bearer ${response_object.token}`];

  const main_body = {
    requestId: Code,
    channel: "APIGW",
    requestParam: {
      data: [
        {
          name: "OfferCode",
          value: accountNumber,
        },
        {
          name: "Msisdn",
          value: MSISDN,
        },
        {
          name: "ChargeAmount",
          value: amount,
        },
        {
          name: "CpId",
          value: PARTNER_CODE,
        },
      ],
    },
    operation: "Payment",
  };

  return {
    payload: JSON.stringify(main_body),
    headers: headers,
    url: url,
    error: "",
  };
};
