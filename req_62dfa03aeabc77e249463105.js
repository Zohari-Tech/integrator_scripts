const main = (payload, headers, constants, client) => {
  const {
    MSISDN,
    accountNumber,
    transactionId,
    amount,
    currentDate,
    narration,
    ISOCurrencyCode,
    customerName,
    paymentMode,
    callback,
    metadata,
  } = payload;

  const header = {
    Authorization: [
      `Basic ${btoa(constants.CONSUMER_KEY + ":" + constants.CONSUMER_SECRET)}`,
    ],
  };

  // NOTE: Getting the basics authorization for request
  // url, method, payload, headers
  // payload, headers, url, method;

  const response = send("", constants.TOKEN_URL, JSON.stringify(header), "GET");

  // FIXME: Authorized caching within the system
  const { access_token, expires_in } = JSON.parse(response);

  // NOTE: Return token error
  if (!response) {
    return {
      requeststring: "",
      headers: headers,
      error: "Empty response",
    };
  }

  // NOTE: Getting the current timestamp
  const now = new Date();

  // NOTE: Formatting the timestamp to YYYYMMDDHHmmss
  const timestamp =
    now.getFullYear().toString() +
    pad(now.getMonth() + 1) +
    pad(now.getDate()) +
    pad(now.getHours()) +
    pad(now.getMinutes()) +
    pad(now.getSeconds());

  log(`${constants.BusinessShortCode} + ${constants.PassKey} + ${timestamp}`);

  // NOTE: Base64 encode for the password

  const password = btoa(
    constants.BusinessShortCode + constants.PassKey + timestamp
  );

  // NOTE: Request building
  const request_obj = {
    BusinessShortCode: constants.BusinessShortCode,
    Password: password,
    Timestamp: timestamp,
    TransactionType: "CustomerPayBillOnline",
    Amount: amount,
    PartyA: accountNumber,
    PartyB: constants.BusinessShortCode,
    PhoneNumber: accountNumber,
    CallBackURL: constants.Callback,
    AccountReference: "CompanyXLTD",
    TransactionDesc: narration,
  };

  // NOTE: Added authorization on the header
  headers["Authorization"] = ["Bearer " + access_token];

  return {
    requeststring: JSON.stringify(request_obj),
    headers: headers,
    error: "",
  };
};

const pad = (n) => {
  return n < 10 ? "0" + n : n;
};
