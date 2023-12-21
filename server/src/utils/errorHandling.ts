import { AxiosError } from "../types/types";
import { CustomError } from "../types/types";

export function isCustomError(error: unknown): error is CustomError {
    return (error as CustomError).message !== undefined;
  }

export function isAxiosError(error: any): error is AxiosError {
    return error && typeof error === 'object' && (error.response || error.message);
  }
