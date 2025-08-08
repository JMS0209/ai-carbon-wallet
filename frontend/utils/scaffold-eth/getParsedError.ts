export const getParsedError = (error: any) => {
  return error?.message || "An error occurred";
};
