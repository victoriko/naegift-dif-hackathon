// Function to get error message based on error code
export const ErrorCode = <K = number>(errorKey: K): string | undefined => {
  // Object containing error codes and their corresponding messages
  const data: { [key: number]: string } = {
    901: 'Unauthorized user',
  };

  // Retrieve the message corresponding to the provided error key
  const message = data[errorKey as unknown as number];

  // Return the message
  return message;
};
