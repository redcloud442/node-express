import { fromNodeHeaders } from "better-auth/node";
import express, { type Router } from "express";
import { auth } from "@/common/auth/auth";
import { healthCheckRouter } from "./healthCheck/healthCheckRouter";
import { userRouter } from "./user/userRouter";

export const api: Router = express.Router();

api.use("/health-check", healthCheckRouter);

api.use("/users", userRouter);

api.get("/me", async (req, res) => {
	const session = await auth.api.getSession({
		headers: fromNodeHeaders(req.headers),
	});
	return res.json(session);
});
