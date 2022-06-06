class Api {
  constructor({ baseURL, headers }) {
    this._baseURL = baseURL;
    this._headers = headers;
  }

  _handleResponse(res) {
    if (res.ok) {
      return res.json();
    } else {
      return Promise.reject(console.log(res.status));
    }
  }

  async login(userObject) {
    const { username, password } = userObject;
    const res = await fetch(`${this._baseURL}/`, {
      method: "POST",
      headers: this._headers,
      body: JSON.stringify({
        username,
        password,
      }),
    });
    const data = this._handleResponse(res);
    return data;
  }

  async verify(token) {
    const res = await fetch(`${this._baseURL}/verify`, {
      method: "POST",
      headers: this._headers,
      body: JSON.stringify({
        token,
      }),
    });
    const data = this._handleResponse(res);
    return data;
  }
}

export default new Api({
  baseURL: "http://localhost:3001",
  headers: {
    authorization: "",
    "Content-Type": "application/json",
  },
});
