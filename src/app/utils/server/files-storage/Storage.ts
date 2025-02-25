import { Storage } from "@google-cloud/storage";

if (
  !process.env.GCP_PROJECT_ID ||
  !process.env.GCP_CLIENT_EMAIL ||
  !process.env.GCP_PRIVATE_KEY
) {
  throw new Error(
    "GCP_PROJECT_ID, GCP_CLIENT_EMAIL, and GCP_PRIVATE_KEY must be set"
  );
}

const storage = new Storage({
  projectId: process.env.GCP_PROJECT_ID,
  credentials: {
    client_email: process.env.GCP_CLIENT_EMAIL,
    private_key: process.env.GCP_PRIVATE_KEY.replace(/\\n/g, "\n"),
  },
});

export default storage;
