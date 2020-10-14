import { GetStaticProps, GetStaticPaths } from "next";
import { getAllProblems, getProblem, Problem } from "../../libs/problems-api";

interface ProblemPageProps {
    problem: Problem;
}

const ProblemPage: React.FC<ProblemPageProps> = ({ problem }) => {
    if (!problem) {
        return <h1>The given problem cannot be found</h1>;
    }
    return (
      <h1>{problem.title}</h1>
    )
};

export default ProblemPage;

export const getStaticPaths: GetStaticPaths = async () => {
    // Get the paths we want to pre-render based on users
    const problems = await getAllProblems();
    console.log(problems);
    const paths = problems.map((problem) => ({
        params: { id: problem.id },
    }));

    // We'll pre-render only these paths at build time.
    // { fallback: false } means other routes should 404.
    return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const id = params?.id;
    const problem = await getProblem(id as string);
    return { props: { problem } };
};
