// Import with `import * as Sentry from "@sentry/node"` if you are using ESM
import * as Sentry from "@sentry/node"

Sentry.init({
  dsn: "https://bac0a79083be6ccb62998b9c0a9c97e1@o4509627576352768.ingest.us.sentry.io/4509627579695104",
  integrations: [Sentry.mongooseIntegration()],

  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
});