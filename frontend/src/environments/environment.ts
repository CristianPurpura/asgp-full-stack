export const environment = {
  production: false,
  // Para simplificar y asegurar que en build (sin reemplazo correcto) apunte al backend HTTPS.
  apiUrl: 'http://98.95.235.51/api',
  cognito: {
    domain: 'https://asgp-ifts11-purpura.auth.us-east-1.amazoncognito.com',
    clientId: '59ef8tvgiv9ud49khfpi0tpeuj',
    region: 'us-east-1',
    userPoolId: 'us-east-1_GMBEbaqV6',
    redirectPath: '/auth/callback'
  }
};
