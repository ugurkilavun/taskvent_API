export type authResponseType = {
  response: {
    message: string;
    access_token?: string;
    refresh_token?: string;
  };
  userId: string;
};