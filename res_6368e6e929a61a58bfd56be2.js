const main = (payload, constants) => {
  return {
    TPCode: "", // Code recieved from payment processor requestId
    Code: "${requestId}", // Tracking code for internal perposes
    RecievedDate: new Date().toISOString(), // Date response received
    StatusCode: "finalstatus", // Final status code as know by our system
    StatusDescription: "Request failed", // Status Description as received from processor
  };
};
