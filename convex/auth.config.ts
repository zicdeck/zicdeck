import { AuthConfig } from "convex/server";

export default {
  providers: [
    {
      // Issuer URL of the Clerk "convex" JWT template, set on the Convex deployment.
      // See https://docs.convex.dev/auth/clerk#configuring-dev-and-prod-instances
      // eslint-disable-next-line @convex-dev/no-process-env -- auth.config.ts is read at deploy time, as in the Clerk docs
      domain: process.env.CLERK_JWT_ISSUER_DOMAIN!,
      applicationID: "convex",
    },
  ],
} satisfies AuthConfig;
