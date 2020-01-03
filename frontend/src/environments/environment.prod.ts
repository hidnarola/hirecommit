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
  env: 'prod',
  production: true,
  staging: false,
  // API_URL: str + host + ':' + port + '/',
  // API_URL: 'http://13.235.235.178:3000/',
  API_URL: 'https://hirecommit.com:3000/',
  // captcha_site_key: '6LfCebwUAAAAAPiHpm2sExyVChiVhhTDe31JTFkc',
  // captcha_site_key: '6Ld35scUAAAAAPIB9rbf4ti5ELsampcdqwNeCgKc',
  captcha_site_key: '6Lem7ccUAAAAABRIlRSa6Nil1yC9m-uLVZTEdR3g',

  // imageUrl: 'http://13.235.235.178:3000/upload/'
  imageUrl: 'https://hirecommit.com:3000/upload/',
  employerURL: 'https://employer.hirecommit.com/',
  candidateURL: 'https://candidate.hirecommit.com/',
  mainURL: 'https://hirecommit.com/'
};
