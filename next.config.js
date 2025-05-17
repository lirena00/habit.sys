/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
  images: {
    domains: [
      "lh3.googleusercontent.com",
      "avatars.githubusercontent.com",
      "cdn.discordapp.com",
      "i.imgur.com",
      "images.unsplash.com",
      "cdn.discordapp.com",
      "media.discordapp.net",
      "www.gravatar.com",
    ],
  },
};

export default config;
