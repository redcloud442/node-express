import express, { type Router } from "express";
import { healthCheckRouter } from "./healthCheck/healthCheckRouter";
import { userRouter } from "./user/userRouter";

export const api: Router = express.Router();

api.use("/health-check", healthCheckRouter);

api.use("/users", userRouter);
