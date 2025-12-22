import { expo } from "@better-auth/expo";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { openAPI } from "better-auth/plugins";
import prisma from "@/common/config/prisma/prisma";

export const auth: ReturnType<typeof betterAuth> = betterAuth({
	database: prismaAdapter(prisma, {
		provider: "postgresql",
	}),
	plugins: [openAPI(), expo()],
	advanced: {
		cookiePrefix: "expogo",
	},
	trustedOrigins: [
		"expogo://",

		// Production & staging schemes
		"expogo-prod://",
		"expogo-staging://",

		// Wildcard support for all paths following the scheme
		"expogo://*",
		// Development mode - Expo's exp:// scheme with local IP ranges
		...(process.env.NODE_ENV === "development"
			? [
					"exp://192.168.x.x:8081",
					"exp://*/*", // Trust all Expo development URLs
					"exp://10.0.0.*:*/*", // Trust 10.0.0.x IP range
					"exp://192.168.*.*:*/*", // Trust 192.168.x.x IP range
					"exp://172.*.*.*:*/*", // Trust 172.x.x.x IP range
					"exp://localhost:*/*", // Trust localhost
					"http://localhost:8081",
				]
			: []),
	],
	emailAndPassword: {
		enabled: true,
		requireEmailVerification: false,
	},
	schema: {
		auth: {
			schema: "auth",
		},
		public: {
			schema: "public",
		},
	},
});
