// /** @type {import('next').NextConfig} */
// const nextConfig = {};

// export default nextConfig;

const createNextIntlPlugin = require("next-intl/plugin");

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {};

module.exports = withNextIntl(nextConfig);
