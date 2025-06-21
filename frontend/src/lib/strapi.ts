import axios from 'axios';

const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'https://api.coffeelogik.com';
const apiToken = process.env.STRAPI_API_TOKEN;

const strapi = axios.create({
  baseURL: `${strapiUrl}/api`,
  headers: {
    'Content-Type': 'application/json',
    ...(apiToken && { Authorization: `Bearer ${apiToken}` }),
  },
});

export default strapi;