export default () => ({
    port: parseInt(process.env.PORT),
    environmentName: process.env.NODE_ENV,
    apiVersion: process.env.API_VERSION,
});