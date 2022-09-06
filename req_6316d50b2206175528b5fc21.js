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
        dest_bank,
        dest_address_line,
        dest_address_city,
      },
      compliance: { source_of_funds, remittance_purpose },
    },
  } = payload;

  // Authorization setup in header
  headers["Authorization"] = [
    `Basic ${btoa(constants.username + ":" + constants.password)}`,
  ];

  const [firstname, lastname] = customerName.split(" ");

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
      id_type: s_id_type,
      id_country: s_id_country,
      id_number: s_id_number,
      address_city: s_address_city,
      address_line: s_address_line,
    },
    destination: {
      type: "bank_account",
      country: "IND",
      legal_name_first: dest_legal_name_first,
      legal_name_last: dest_legal_name_last,
      mobile_number: dest_mobile_number,
      bank: dest_bank,
      account_number: accountNumber,
      address_line: dest_address_line,
      address_city: dest_address_city,
    },
    compliance: {
      source_of_funds: source_of_funds,
      remittance_purpose: remittance_purpose,
    },
  };

  return {
    payload: JSON.stringify(built_request),
    headers: headers,
    url: url + Code,
  };
};
