import { AuthToken } from '../../types';
import { Request, HttpMethod } from '../../request';

/**
 * Get auth token.
 */
export async function getAuthToken() {
  const request = new Request<AuthToken>()
    .method(HttpMethod.POST)
    .endpoint('authentication/v1/authentication/login')
    .body({
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      userAccessType: process.env.USER_ACCESS_TYPE,
    })
    .noAuthWarn(true);

  const response = await request.send();

  return response.token.accessToken;
}
