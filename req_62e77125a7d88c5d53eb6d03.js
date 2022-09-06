const ACCOUNT_NUMBER_SIZE = 9;

const main = (payload, headers, constants, client, url) => {
  const {
    MSISDN,
    accountNumber,
    externalCode,
    amount,
    currentDate,
    narration,
    ISOCurrencyCode,
    customerName,
    paymentMode,
    Code,
    callback,
    metadata,
  } = payload;

  // FIXME:
  // Create api to get products from based on amount
  // Create a check of products
  // Get productID from the meta data
  const { ProductID } = metadata;

  // validate the account number as a mobile number
  const mobileNumber = accountNumber.replace(/\D/g, "").substring(3);

  if (mobileNumber.length !== ACCOUNT_NUMBER_SIZE) {
    return {
      payload: "",
      headers: headers,
      error: "Invalid Account number, Should be +254-{9digits}",
    };
  }
  // NOTE: Getting the current timestamp
  const now = new Date();
  const year = now.getFullYear().toString();
  const month = pad(now.getMonth() + 1);
  const date = pad(now.getDate());
  const hrs = pad(now.getHours());
  const mins = pad(now.getMinutes());
  const sec = pad(now.getSeconds());

  const noncetime = `${year + month + date + hrs + mins + sec}`;
  const timespan =
    year + "-" + month + "-" + date + "T" + hrs + ":" + mins + ":" + sec + "Z";

  // utf8 encode then base64
  const nonce = btoa(noncetime);

  const rawStr = nonce + timespan + constants.AppSecret;

  const sha256str = SHA256(rawStr);

  // Headers setup
  headers["Authorization"] = ['WSSE realm="DOP", profile="UsernameToken"'];
  headers["X-RequestHeader"] = [`request TransId="${Code}"`];
  headers["X-WSSE"] = [
    `UsernameToken Username="${constants.AppKey}", PasswordDigest="${sha256str}", Nonce="${nonce}", Created="${timespan}"`,
  ];

  // Build the headers
  const request = {
    ProductID: ProductID,
    MSISDN: mobileNumber,
  };

  log(JSON.stringify(request));
  return {
    payload: JSON.stringify(request),
    headers: headers,
    url: url,
    error: "",
  };
};

const pad = (n) => {
  return n < 10 ? "0" + n : n;
};
