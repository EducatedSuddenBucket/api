
module.exports = async (req, res) => {
  // First step: POST request to login endpoint to retrieve cookies
  const loginUrl = 'https://liaobots.work/recaptcha/api/login';
  const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36';

  try {
    // Send login request
    const loginResponse = await fetch(loginUrl, {
      method: 'POST',
      headers: {
        'User-Agent': userAgent
      }
    });

    // Extract the 'set-cookie' header to get gkp2
    const cookies = loginResponse.headers.get('set-cookie');
    const gkp2Cookie = extractCookieValue(cookies, 'gkp2');

    if (!gkp2Cookie) {
      res.status(500).send('Failed to retrieve gkp2 cookie');
      return;
    }

    // Second step: Use the gkp2 cookie to make the request to /api/user
    const apiUrl = 'https://liaobots.work/api/user';
    const headers = {
      'authority': 'liaobots.work',
      'accept': '*/*',
      'accept-language': 'en-US,en;q=0.9',
      'content-type': 'application/json',
      'cookie': `gkp2=${gkp2Cookie}`,
      'origin': 'https://liaobots.work',
      'referer': 'https://liaobots.work/en',
      'sec-ch-ua': '"Not-A.Brand";v="99", "Chromium";v="124"',
      'sec-ch-ua-mobile': '?1',
      'sec-ch-ua-platform': '"Android"',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-origin',
      'user-agent': userAgent
    };

    const body = JSON.stringify({
      authcode: ""
    });

    const apiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: headers,
      body: body
    });

    const data = await apiResponse.json();
    
    res.status(200).json(data);

  } catch (error) {
    res.status(500).send('Error: ' + error.message);
  }
};

// Helper function to extract specific cookie value
function extractCookieValue(cookies, cookieName) {
  if (!cookies) return null;
  const match = cookies.match(new RegExp(`${cookieName}=([^;]+)`));
  return match ? match[1] : null;
  }
