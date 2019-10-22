const host = window.location.hostname;
const port = 3000;
let https = false;
let str = 'http://';
let web_host = host;

if (host === 'localhost') {
  https = false;
  str = 'http://';
  web_host = host + ':4200';
}

export const environment = {
  production: true,
  API_URL: str + host + ':' + port + '/',
  captcha_site_key: '6LfCebwUAAAAAPiHpm2sExyVChiVhhTDe31JTFkc',
};
