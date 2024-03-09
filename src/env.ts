export const env = {
    port: process.env.PORT || 3000,
    dbHost: process.env.DB_HOST || "127.0.0.1",
    dbPort: Number(process.env.DB_PORT) || 5432,
    dbUsername: process.env.DB_USERNAME || "admin",
    dbPassword: process.env.DB_PASSWORD || "admin",
    dbName: process.env.DB_NAME || "appointment_db",
    jwtSecret: process.env.JWT_SECRET || "jwt_secret",
    rabbitmqDefaultUser: process.env.RABBITMQ_DEFAULT_USER || "user",
    rabbitmqDefaultPass: process.env.RABBITMQ_DEFAULT_PASS || "password",
    rabbitmqHost: process.env.RABBITMQ_HOST || "127.0.0.1",
}