// encodes all characters encoded with encodeURIComponent, plus: ! ~ * ' ( )
const fullyEncodeURI = value => encodeURIComponent(value)
  .replace(/!/g, '%21')
  .replace(/'/g, '%27')
  .replace(/\(/g, '%28')
  .replace(/\)/g, '%29')
  .replace(/\*/g, '%2a')
  .replace(/~/g, '%7e');

const oauth = {
    consumer_key: process.env.TWITTER_CONSUMER_KEY || '',
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET || '',
    token: process.env.TWITTER_ACCESS_TOKEN_KEY || '',
    token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET || ''
}

module.exports = {
    fullyEncodeURI,
    oauth
}