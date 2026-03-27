function handleError(error, fallbackMsg = "Something went wrong") {
  const serverMsg = error?.response?.data?.message;

  if (serverMsg) {
    throw new Error(serverMsg);
  } else {
    throw new Error(fallbackMsg);
  }
}

export default handleError;