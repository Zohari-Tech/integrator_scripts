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
        s_company_trading_name,
        co_reg_no,
        co_reg_country,
        s_address_line,
        s_address_city,
        s_address_country,
      },
      destination: {
        company_name,
        dest_address_zip,
        dest_address_line,
        dest_address_city,
        dest_bank,
        dest_branch,
      },
      compliance: { source_of_funds, remittance_purpose },
    },
  } = payload;

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
      segment: "business",
      mobile_number: MSISDN,
      company_name: customerName,
      company_trading_name: s_company_trading_name,
      company_registration_number: co_reg_no,
      company_registration_country: co_reg_country,
      address_line: s_address_line,
      address_city: s_address_city,
      address_country: s_address_country,
    },
    destination: {
      type: "bank_account",
      country: "JPN",
      segment: "business",
      company_name: company_name,
      bank: dest_bank,
      branch: dest_branch,
      account_number: accountNumber,
      address_line: dest_address_line,
      address_city: dest_address_city,
      address_zip: dest_address_zip,
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
