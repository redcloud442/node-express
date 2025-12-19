import { StatusCodes } from "http-status-codes";

import type { User } from "@/api/user/userModel";
import { findAllAsync, findByIdAsync } from "@/api/user/userRepository";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";

// Retrieves all users from the database
export const findAll = async (): Promise<ServiceResponse<User[] | null>> => {
	try {
		const users = await findAllAsync();

		if (!users || users.length === 0) {
			return ServiceResponse.failure("No Users found", null, StatusCodes.NOT_FOUND);
		}

		return ServiceResponse.success<User[]>("Users found", users);
	} catch (ex) {
		const errorMessage = `Error finding all users: ${(ex as Error).message}`;
		logger.error(errorMessage);

		return ServiceResponse.failure(
			"An error occurred while retrieving users.",
			null,
			StatusCodes.INTERNAL_SERVER_ERROR,
		);
	}
};

// Retrieves a single user by their ID
export const findById = async (id: number): Promise<ServiceResponse<User | null>> => {
	try {
		const user = await findByIdAsync(id);

		if (!user) {
			return ServiceResponse.failure("User not found", null, StatusCodes.NOT_FOUND);
		}

		return ServiceResponse.success<User>("User found", user);
	} catch (ex) {
		const errorMessage = `Error finding user with id ${id}: ${(ex as Error).message}`;
		logger.error(errorMessage);

		return ServiceResponse.failure("An error occurred while finding user.", null, StatusCodes.INTERNAL_SERVER_ERROR);
	}
};
