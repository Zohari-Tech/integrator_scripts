const ACCOUNT_NUMBER_SIZE = 12;

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

  // FIXME:
  // Create api to get products from based on amount
  // Create a check of products
  // Get productID from the meta data
  const { ProductID } = metadata;

  // validate the account number as a mobile number
  const mobileNumber = accountNumber.replace(/\D/g, "").substring(3);

  if (mobileNumber.length !== ACCOUNT_NUMBER_SIZE) {
    return {
      requeststring: "",
      headers: headers,
      error: "Invalid Account number, Should be +254-{9digits}",
    };
  }
  //
  // const timestamp =
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
  const nonce = btoa(encodeURI(noncetime));

  const rawStr = nonce + timespan + constants.AppSecret;

  const rawStrEncode = btoa(rawStr);

  const sha256str = SHA256(rawStrEncode);

  const sha256strBase64 = btoa(sha256str);

  // Headers setup
  headers["Authorization"] = ['WSSE realm="DOP", profile="UsernameToken"'];
  headers["X-RequestHeader"] = [`request TransId="${transactionId}"`];
  headers["X-WSSE"] = [
    `UsernameToken Username="${constants.AppKey}", PasswordDigest="${sha256strBase64}", Nonce="${nonce}", Created="${timespan}"`,
  ];

  // Build the headers
  const request = {
    ProductID: ProductID,
    MSISDN: mobileNumber,
  };
  return {
    requeststring: JSON.stringify(request),
    headers: headers,
    error: "",
  };
};
