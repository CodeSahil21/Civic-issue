import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";
import { ApiError } from "./apiError";

// Simple token generation
export const generateToken = (userId: string, role: string) => {
    return jwt.sign(
        { 
            id: userId,
            role: role 
        },
        process.env.JWT_SECRET as string,
        { expiresIn: '7d' }
    );
};

// Generate token with user data
export const generateTokenWithUser = async (userId: string) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                fullName: true,
                email: true,
                role: true,
                wardId: true,
                zoneId: true
            }
        });

        if (!user) {
            throw new ApiError(404, "User not found");
        }

        const token = generateToken(user.id, user.role);

        return { 
            token, 
            user: {
                id: user.id,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
                wardId: user.wardId,
                zoneId: user.zoneId
            }
        };

    } catch (error) {
        throw new ApiError(500, "Token generation failed");
    }
};

// Verify token (utility function)
export const verifyToken = (token: string) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET as string) as {
            id: string;
            role: string;
        };
    } catch (error) {
        throw new ApiError(401, "Invalid token");
    }
};

// Decode token without verification (for expired token info)
export const decodeToken = (token: string) => {
    return jwt.decode(token) as { id: string; role: string } | null;
};