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
        s_company_trading_name,
        s_address_line,
        s_address_city,
        s_address_country,
      },
      destination: {
        dest_company_name,
        dest_bank,
        dest_address_line,
        dest_address_city,
      },
      compliance: { remittance_purpose, source_of_funds },
    },
  } = payload;

  // Authorization setup in header
  headers["Authorization"] = [
    `Basic ${btoa(constants.username + ":" + constants.password)}`,
  ];

  const built_request = {
    destination_amount: {
      currency: ISOCurrencyCode,
      units: amount,
    },
    source: {
      type: "partner",
      country: "KEN",
      segment: "business",
      company_name: customerName,
      company_trading_name: s_company_trading_name,
      address_city: s_address_city,
      address_line: s_address_line,
      company_registration_country: co_reg_country,
      company_registration_number: co_reg_no,
      address_country: s_address_country,
      mobile_number: MSISDN,
    },
    destination: {
      type: "bank_account",
      segment: "business",
      country: "IND",
      company_name: dest_company_name,
      mobile_number: dest_company_name,
      account_number: accountNumber,
      bank: dest_bank,
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
