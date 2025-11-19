export const environment = {
  production: true,
  apiUrl: 'http://98.95.235.51:3000/api',
  cognito: {
    domain: 'https://asgp-ifts11-purpura.auth.us-east-1.amazoncognito.com',
    clientId: '59ef8tvgiv9ud49khfpi0tpeuj',
    region: 'us-east-1',
    userPoolId: 'us-east-1_GMBEbaqV6',
    // Se actualizará dinámicamente el redirectUri en runtime según dominio
    redirectPath: '/auth/callback'
  }
};
