const handleServiceErrors = (err) => {
  let response;
  if (err.response) {
    response = err.response.data;
  } else if (err.request) {
    response = {
      status: "error",
      message:
        "No response received from the server, check your internet connection and try again.",
    };
  } else {
    response = {
      status: "error",
      message: "Error when creating request to send to the server.",
    };
  }
  return response;
};

export default handleServiceErrors;
