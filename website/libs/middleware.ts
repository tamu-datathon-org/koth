import { NowResponse, NowRequest } from "@vercel/node";
import { User, GatekeeperRequestError } from "../components/UserProvider";
import { authenticatedFetch } from "./fetcher";

type AuthenticatedRouteHandler = (
  req: NowRequest,
  res: NowResponse,
  user: User
) => void;

export const authenticatedRoute = (
  handler: AuthenticatedRouteHandler
) => async (req: NowRequest, res: NowResponse): Promise<void> => {
  const response: User | GatekeeperRequestError = await authenticatedFetch(
    `${process.env.GATEKEEPER_URL}/user`,
    req,
    {
      headers: {
        accept: "application/json",
      },
    }
  );

  if ((response as GatekeeperRequestError).statusCode === 401)
    return res
      .writeHead(302, {
        Location: `/auth/login?r=${req.url}`,
      })
      .end();

  return handler(req, res, response as User);
};
