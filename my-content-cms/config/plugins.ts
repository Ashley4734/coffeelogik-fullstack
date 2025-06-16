export default ({ env }: { env: Function }) => ({
  upload: {
    config: {
      provider: "aws-s3",
      providerOptions: {
        credentials: {
          accessKeyId: env("R2_ACCESS_KEY_ID"),
          secretAccessKey: env("R2_SECRET_ACCESS_KEY"),
        },
        region: env("R2_REGION", "auto"),
        params: {
          Bucket: env("R2_BUCKET"),
        },
        endpoint: `https://${env("R2_ACCOUNT_ID")}.r2.cloudflarestorage.com`,
        baseUrl: env("R2_PUBLIC_URL"),
      },
    },
  },
});
