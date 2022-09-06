const main = (payload, headers, constants, client, url) => {
  const {
    MSISDN,
    accountNumber,
    Code,
    amount,
    currentDate,
    narration,
    ISOCurrencyCode,
    externalCode,
    customerName,
    paymentMode,
    callback,
    metadata: {
      source: {
        date_of_birth,
        nationality,
        s_id_number,
        s_id_type,
        s_id_country,
        s_address_line,
        s_address_city,
        s_address_country,
      },
      destination: {
        dest_legal_name_first,
        dest_legal_name_last,
        dest_mobile_number,
      },
      compliance: { remittance_purpose },
    },
  } = payload;

  const [firstname, lastname] = customerName.split(" ");

  // Authorization setup in header
  headers["Authorization"] = [
    `Basic ${btoa(constants.username + ":" + constants.password)}`,
  ];

  const built_request = {
    source_amount: {
      currency: ISOCurrencyCode,
      units: amount,
    },
    source: {
      type: "partner",
      country: "KEN",
      segment: "individual",
      legal_name_first: firstname,
      legal_name_last: lastname,
      date_of_birth: date_of_birth,
      nationality: nationality,
      address_city: s_address_city,
      address_line: s_address_line,
      address_country: s_address_country,
      mobile_number: MSISDN,
      id_number: s_id_number,
      id_type: s_id_type,
      id_country: s_id_country,
    },
    destination: {
      type: "bank_account",
      country: "CHN",
      legal_name_first: dest_legal_name_first,
      legal_name_last: dest_legal_name_last,
      mobile_number: dest_mobile_number,
      account_number: accountNumber,
    },
    compliance: {
      remittance_purpose: remittance_purpose,
    },
  };

  return {
    payload: JSON.stringify(built_request),
    headers: headers,
    url: url + Code,
  };
};
