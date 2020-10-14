import { Request, Response, NextFunction } from 'express';
import fetch from "node-fetch";

/**
 * Middleware to check if request is authenticated as an admin user
 */
export const adminAuth = (gatekeeperUrl: string) => async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.accessToken || "";

    if (!token) 
        return res.redirect(`/auth/login?r=${req.path}`, 302); 

    const authRes = await fetch(`${gatekeeperUrl}/user`, { 
        headers: {
            Accept: "application/json",
            Cookie: `accessToken=${token}`
        } 
    })

    if (authRes.status != 200)
        return res.redirect(`/auth/login?r=${req.path}`, 302); 

    const json = await authRes.json();

    if (!json["isAdmin"])
        return res.status(401).send();

    return next();
} 