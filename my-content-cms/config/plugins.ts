export default ({ env }: { env: Function }) => ({
  upload: {
    config: {
      provider: "strapi-provider-upload-cloudflare-r2",
      providerOptions: {
        accessKeyId: env("R2_ACCESS_KEY_ID"),
        secretAccessKey: env("R2_SECRET_ACCESS_KEY"),
        region: env("R2_REGION", "auto"),
        params: {
          Bucket: env("R2_BUCKET"),
          accountId: env("R2_ACCOUNT_ID"),
        },
        cloudflarePublicAccessUrl: env("R2_PUBLIC_URL"),
      },
    },
  },
});
