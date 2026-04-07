class AppError extends Error {
  constructor({ message, status, error }) {
    super(message);
    this.status = status;
    this.error = error;
  }
}

function handleError(error, fallbackMsg = "Something Went Wrong") {
  // handle error message if there is no message from the server
  const message =
    error?.response?.data?.message || error?.message || fallbackMsg;
  const status = error?.response?.status || 500;

  return new AppError({ message, status, error });
}

export default handleError;
