import { Request } from "express";

// Extended Request types
export interface TypedRequest<T> extends Request {
  body: T;
}
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export type UserType = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isActive?: boolean;
};
