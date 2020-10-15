import { NowRequest, NowResponse } from "@vercel/node";
import { authenticatedRoute } from "../../../libs/middleware";
import { User } from "../../../components/UserProvider";
import { getProblem } from "../../../libs/problems-api";
import { getUserSubmissions } from "../../../libs/submissions-api";

const getProblemDataHandler = async (
  req: NowRequest,
  res: NowResponse,
  user: User
): Promise<void> => {
  const problemId = req.query.id as string;

  const problem = await getProblem(problemId);
  if (!problem) {
    res.status(404).json({err: "Problem with the given ID could not be found"});
    return;
  }
  const submissions = await getUserSubmissions(user.authId, problemId);

  res.status(200).json({ problem, submissions });
  return;
};

export default authenticatedRoute(getProblemDataHandler);
