import chalk from 'chalk';

// Global session.
type Session = {
  token: string | undefined;
};
export const Session: Session = {
  token: undefined,
};

export const HttpMethod = {
  GET: 'GET',
  POST: 'POST',
  PATCH: 'PATCH',
} as const;
type HttpMethod = (typeof HttpMethod)[keyof typeof HttpMethod];

export class Request<T> {
  protected _method: HttpMethod = HttpMethod.GET;
  protected _endpoint: string = '';
  protected _headers: Record<string, string> = {};
  protected _body: any;
  protected _noAuthWarn: boolean = false;

  method = (value: HttpMethod): Request<T> => {
    this._method = value;
    return this;
  };

  endpoint = (value: string): Request<T> => {
    this._endpoint = value;
    return this;
  };

  headers = (value: Record<string, string>): Request<T> => {
    this._headers = value;
    return this;
  };

  body = (value: any): Request<T> => {
    this._body = value;
    return this;
  };

  noAuthWarn = (value: boolean): Request<T> => {
    this._noAuthWarn = value;
    return this;
  };

  send = async (): Promise<T> => {
    const headers = new Headers({
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...this._headers,
    });

    if (!Session.token && !this._noAuthWarn) {
      console.log(chalk.red('Warning: no auth token'));
    }

    if (Session.token) {
      headers.set('Authorization', `Bearer ${Session.token}`);
    }

    const fetchOptions: RequestInit = {
      method: this._method,
      headers,
    };

    if (this._body) {
      fetchOptions.body = JSON.stringify(this._body);
    }

    const response = await fetch(
      `${process.env.ENVIRONMENT_URL}/${this._endpoint}`,
      fetchOptions
    );

    if (!response.ok) {
      if (response.json) {
        const errorResponse = await response.json();
        throw errorResponse;
      }
      throw new Error(`Response status: ${response.status}`);
    }

    return response.json();
  };
}
