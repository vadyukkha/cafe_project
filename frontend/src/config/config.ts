interface ApiConfig {
    host: string;
    port: string;
    prefix: string;
    baseUrl: string;
}

const host: string = process.env.NEXT_PUBLIC_API_HOST || 'localhost';
const port: string = process.env.NEXT_PUBLIC_API_PORT || '3000';
const prefix: string = '/api/v1';

const baseUrl: string = `http://${host}:${port}${prefix}`;

const apiConfig: ApiConfig = {
    host,
    port,
    prefix,
    baseUrl,
};

export default apiConfig;
