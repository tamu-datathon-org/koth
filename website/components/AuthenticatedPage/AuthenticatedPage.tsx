import { useRouter } from "next/router";
import { useActiveUser, UserCurrentStatus } from "../UserProvider";

export interface AuthenticatedPageProps {
  children?: React.ReactNode;
}

export const AuthenticatedPage: React.FC<AuthenticatedPageProps> = ({
  children,
}) => {
  const { status } = useActiveUser();
  const router = useRouter();

  if (
    status === UserCurrentStatus.LoggedOut ||
    status === UserCurrentStatus.Errored
  ) {
    // NextJS will prepend 'koth' to the path if we use
    // router.push.
    window.location.assign(`/auth/login?r=${
          process.browser
            ? window.location.pathname
            : `${router.basePath}${router.asPath}`
        }`);
    // TODO: Return a "Please login" page here instead of the normal page.
  }

  return <>{children}</>;
};
