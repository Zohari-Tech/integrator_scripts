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
        co_reg_no,
        co_reg_country,
        s_address_line,
        s_address_city,
        s_address_country,
      },
      destination: { address_line, swift_code, company_name },
      compliance: { source_of_funds, remittance_purpose },
    },
  } = payload;

  // Authorization setup in header
  headers["Authorization"] = [
    `Basic ${btoa(constants.username + ":" + constants.password)}`,
  ];

  const built_request = {
    source: {
      type: "partner",
      country: "KEN",
      segment: "business",
      company_name: customerName,
      company_trading_name: customerName,
      company_registration_number: co_reg_no,
      company_registration_country: co_reg_country,
      address_line: s_address_line,
      address_city: s_address_city,
      address_country: s_address_country,
      mobile_number: MSISDN,
    },
    destination: {
      type: "bank_account",
      country: "CHN",
      currency: "CNH",
      segment: "business",
      swift_code: swift_code,
      account_number: accountNumber,
      address_line: address_line,
      company_name: company_name,
    },
    compliance: {
      source_of_funds: source_of_funds,
      remittance_purpose: remittance_purpose,
    },
    destination_amount: {
      currency: "CNH",
      units: amount,
    },
  };

  return {
    payload: JSON.stringify(built_request),
    headers: headers,
    url: `${url + Code}.${externalCode}`,
  };
};
