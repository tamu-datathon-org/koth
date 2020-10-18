import { NowRequest, NowResponse } from "@vercel/node";
import { authenticatedRoute } from "../../../libs/middleware";
import { getProblem } from "../../../libs/problems-api";
import { getSubmissionsForProblem } from "../../../libs/submissions-api";

const getProblemDataHandler = async (
  req: NowRequest,
  res: NowResponse
): Promise<void> => {
  const problemId = req.query.id as string;

  const problem = await getProblem(problemId);
  if (!problem) {
    res
      .status(404)
      .json({ err: "Problem with the given ID could not be found" });
    return;
  }
  const submissions = await getSubmissionsForProblem(problemId);
  // Sort by score - descending order.
  const sortedSubmissions = submissions.sort((a, b) =>
    a.score < b.score ? 1 : -1
  );
  let userAuthIdSet = new Set();
  const filteredSubmissions = sortedSubmissions.slice().filter((val) => {
    if (userAuthIdSet.has(val.userAuthId)) {
      return false;
    }
    userAuthIdSet.add(val.userAuthId);
    return true;
  });

  res.status(200).json({ problem, submissions: filteredSubmissions });
  return;
};

export default authenticatedRoute(getProblemDataHandler);
