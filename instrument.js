const Sentry = require("@sentry/node");
Sentry.init({
  dsn: "https://5ea0bfa0ab40c5b4923c6d6ea853b757@o4509517772488704.ingest.us.sentry.io/4509517774061568",
  sendDefaultPii: true,
});