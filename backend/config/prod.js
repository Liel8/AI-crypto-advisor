export default {
  dbURL: process.env.DB_URL,
  dbName: process.env.DB_NAME || 'crypto_advisor_db',
  jwtSecret: process.env.JWT_SECRET
}
