const main = (payload, constants) => {
  const { transactionId, callBackUrl, offerCode, msisdn } = payload;
  const {
    serviceUrl,
    PARTNER_CODE,
    TOKEN_URL,
    USERNAME,
    PASSWORD,
    SERVICE_CALLBACK,
  } = constants;

  let finalstatus = "TRX400";

  const auth_headers = {
    "Content-Type": [`application/json`],
    Accept: [`application/json`],
    "X-Requested-With": ["XMLHttpRequest"],
  };
  const auth_body = {
    username: USERNAME,
    password: PASSWORD,
  };
  const auth_response = send(
    JSON.stringify(auth_body),
    TOKEN_URL,
    JSON.stringify(auth_headers),
    "POST"
  );

  if (!auth_response) {
    return {
      TPCode: "", // Code recieved from payment processor requestId
      Code: `${requestId}`, // Tracking code for internal perposes
      RecievedDate: new Date().toISOString(), // Date response received
      StatusCode: finalstatus, // Final status code as know by our system
      StatusDescription: "Request failed", // Status Description as received from processor
    };
  }

  const response_object = JSON.parse(auth_response);

  if (response_object.hasOwnProperty("errorCode")) {
    return {
      TPCode: "", // Code recieved from payment processor requestId
      Code: transactionId, // Tracking code for internal perposes
      RecievedDate: new Date().toISOString(), // Date response received
      StatusCode: finalstatus, // Final status code as know by our system
      StatusDescription: response_object.message,
    };
  }

  const headers = {
    "Accept-Encoding": ["application/json"],
    "Accept-Language": ["EN"],
    "Content-Type": ["application/json"],
    "X-App": ["ussd"],
    "X-Source-Division": ["DIT"],
    "X-Source-CountryCode": ["KE"],
    "X-Source-Operator": ["Safaricom"],
    "X-Source-System": ["web-portal"],
    "X-Version": ["1.0.0"],
    "X-Correlation-Conversation-ID": [`${transactionId}`],
    "X-MessageID": [`${transactionId}`],
    "X-Source-Timestamp": [`${new Date().toISOString()}`],
    "X-api-auth-token": [`Bearer ${response_object.token}`],
  };

  const body = {
    msisdn: msisdn,
    offerCode: offerCode,
    CpId: PARTNER_CODE,
    callBackUrl: SERVICE_CALLBACK,
  };

  const response = send(
    JSON.stringify(body),
    serviceUrl,
    JSON.stringify(headers),
    "POST"
  );

  if (!response) {
    return {
      TPCode: "", // Code recieved from payment processor requestId
      Code: transactionId, // Tracking code for internal perposes
      RecievedDate: new Date().toISOString(), // Date response received
      StatusCode: finalstatus, // Final status code as know by our system
      StatusDescription: "Request failed", // Status Description as received from processor
    };
  }

  const main_res_obj = JSON.parse(response);

  if (main_res_obj.responseParam.statusCode === "113") {
    finalstatus = "TRX204";
  }

  return {
    TPCode: "", // Code recieved from payment processor requestId
    Code: transactionId, // Tracking code for internal perposes
    RecievedDate: new Date().toISOString(), // Date response received
    StatusCode: finalstatus, // Final status code as know by our system
    StatusDescription: "Request failed", // Status Description as received from processor
  };
};
