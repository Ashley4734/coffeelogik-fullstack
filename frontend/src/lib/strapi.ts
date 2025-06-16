import axios from 'axios';

const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'https://y0o4w84ckoockck8o0ss8s48.tealogik.com';
const apiToken = process.env.STRAPI_API_TOKEN;

const strapi = axios.create({
  baseURL: `${strapiUrl}/api`,
  headers: {
    'Content-Type': 'application/json',
    ...(apiToken && { Authorization: `Bearer ${apiToken}` }),
  },
});

export default strapi;