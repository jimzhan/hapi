import ms from 'ms'

const debug = [undefined, 'development'].includes(process.env.NODE_ENV)

module.exports = {
  host: '127.0.0.1',
  port: 9394,
  secret: 'g7zUArgVs3uIOMFlY7zACNFehHNSolMzOkZEQpXSzodLNDcONFenBt2vNy_zew_tC1_h2yfrmaj4lrbo',
  cookie: {
    isSecure: !debug,
    isHttpOnly: !debug,
    isSameSite: 'Lax',
    path: '/',
    domain: null,
    ttl: ms('1d'),
    password: '2VjlRUrs0NngsNvb4-zzRbSPYNEcajCAjl_PCzK4bYZsRThpJMXT-5Qpyu7EO3vEyVPXgnWFyCNGlNgU'
  }
}
