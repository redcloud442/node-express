import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";
import { pino } from "pino";
import { api } from "@/api/api";
import { openAPIRouter } from "@/api-docs/openAPIRouter";
import { auth } from "@/common/auth/auth";
import errorHandler from "@/common/middleware/errorHandler";
import rateLimiter from "@/common/middleware/rateLimiter";
import requestLogger from "@/common/middleware/requestLogger";

const corsOptions: cors.CorsOptions = {
	origin: [
		"expogo://",

		// Production & staging schemes
		"expogo-prod://",
		"expogo-staging://",

		// Wildcard support for all paths following the scheme
		"expogo://*",

		// Development mode - Expo's exp:// scheme with local IP ranges
		...(process.env.NODE_ENV === "development"
			? [
					"exp://*/*", // Trust all Expo development URLs
					"exp://10.0.0.*:*/*", // Trust 10.0.0.x IP range
					"exp://192.168.*.*:*/*", // Trust 192.168.x.x IP range
					"exp://172.*.*.*:*/*", // Trust 172.x.x.x IP range
					"exp://localhost:*/*", // Trust localhost
					"http://localhost:8081",
				]
			: []),
	],
	credentials: true,
	methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
	allowedHeaders: ["Content-Type", "Authorization", "x-better-auth-origin"],
};

const logger = pino({ name: "server start" });
const app: Express = express();

// Set the application to trust the reverse proxy
app.set("trust proxy", true);

// Middlewares
app.use(cors(corsOptions));

app.all("/api/auth/*splat", toNodeHandler(auth));
app.use("/api", api);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(helmet());
app.use(rateLimiter);

// Request logging
app.use(requestLogger);

// Routes

// Swagger UI
app.use(openAPIRouter);

// Error handlers
app.use(errorHandler());

export { app, logger };
