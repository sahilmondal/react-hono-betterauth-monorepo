import { auth } from "@/lib/auth";
import { authMiddleware } from "@/middleware/auth";
import { HonoContext } from "@/types";
import { Hono } from "hono";
import { z } from "zod";

const usersRoute = new Hono<HonoContext>();

const updateUserSchema = z.object({
  name: z.string().optional(),
  avatar: z.string().url().optional(),
});

// GET /users/me - Get current user profile
usersRoute.get("/me", authMiddleware, async (c) => {
  const user = c.get("user");
  return c.json({ user });
});

export default usersRoute;
