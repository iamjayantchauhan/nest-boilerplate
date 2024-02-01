export default () => ({
    port: parseInt(process.env.PORT),
    environmentName: process.env.NODE_ENV,
    apiVersion: process.env.API_VERSION,
    database: process.env.DATABASE_URL,
    email: {
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        user: process.env.EMAIL_USER,
        password: process.env.EMAIL_PASSWORD,
    },
});