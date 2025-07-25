const URL = process.env.NEXT_PUBLIC_API_URL;

const fetchAPI = async (url: string, method = 'GET', body?: any) => {
  try {
    const response = await fetch(`${URL}${url}`, {
      method,
      credentials: 'include', //Send cookies
      headers: {
        'Content-Type': 'application/json',
      },
      body: body && method !== 'GET' ? JSON.stringify(body) : undefined,
    });

    if (response.status === 401 && url !== '/auth/refresh') {
      const refreshResponse = await fetch(`${URL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
      });

      if (refreshResponse.ok) {
        // Thử lại request ban đầu
        return fetchAPI(url, method, body);
      } else {
        // throw new Error("Refresh token failed. User should re-login.");
        // const errorResponse = await response.json();
        // throw new Error(errorResponse.detail || "Refresh token failed. User should re-login.");
      }
    }

    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(errorResponse.detail || 'Some error');
    }

    return await response.json();
  } catch (err: any) {
    if (err?.status != 401) throw err;
  }
};

export { fetchAPI };
