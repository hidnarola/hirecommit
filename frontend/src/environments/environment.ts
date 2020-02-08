// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
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
  env: 'dev',
  production: false,
  staging: false,
  captcha_site_key: '6LeZgbkUAAAAAIft5rRxJ27ODXKzH_44jCRJtdPU',
  // API_URL: str + host + ':' + port + '/',
  // API_URL: 'http://192.168.100.23:3000/',
  API_URL: 'http://192.168.100.11:3000/',
  // API_URL: ' https://13.235.2/35.178:3000/',
  // API_URL: 'https://hirecommit.com:3000/',
  // API_URL: 'https://tanubhasin.com:3000/',
  // API_URL: 'localhost:3000/',
  // imageUrl: str + host + ':' + port + '/upload/'
  // imageUrl: ' http://13.235.235.178' + '/upload/'
  imageUrl: 'http://192.168.100.11:3000' + '/upload/',
  employerURL: 'http://localhost:4200/',
  candidateURL: 'http://localhost:4200/',
  mainURL: 'http://localhost:4200/'
};
