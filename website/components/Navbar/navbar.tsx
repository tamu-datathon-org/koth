import React from "react";
import { faUserCircle } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Navbar as ReactNavbar,
  Nav as ReactNav,
  Dropdown,
} from "react-bootstrap";
import { useActiveUser, UserCurrentStatus } from "../UserProvider";
import { useRouter } from "next/router";
import styles from "./navbar.module.scss";

export const Navbar = () => {
  const { user, status } = useActiveUser();
  const router = useRouter();

  const navbarUserDropdown: any = (
    <Dropdown>
      <Dropdown.Toggle className={styles.navbarDropdownToggle}>
        <FontAwesomeIcon className={styles.navbarUserInfo} icon={faUserCircle} />
      </Dropdown.Toggle>
      <Dropdown.Menu className="dropdown-menu-right">
        <Dropdown.Header>{user?.email}</Dropdown.Header>
        <Dropdown.Item href="/auth/logout?r=/koth">Logout</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );

  return (
    <ReactNavbar className={styles.navbar} expand="sm">
      <span className={styles.navbarSpan}>
        <ReactNavbar.Toggle aria-controls="navbar-responsive-dropdown" />
        <img
          src="/events/static/img/logos/main.png"
          className={`d-none d-sm-block ${styles.navbarLogo}`} // Hide icon below sm screens.
        ></img>
      </span>
      <ReactNavbar.Collapse
        id="navbar-responsive-dropdown"
        className="justify-content-center"
      >
        <ReactNav>
          <ReactNav.Link className={styles.navLink} href="/">Home</ReactNav.Link>
          <ReactNav.Link className={styles.navLink} href="/events">Events</ReactNav.Link>
          <ReactNav.Link className={styles.navLink} href="/schedule">Schedule</ReactNav.Link>
          <ReactNav.Link className={styles.navLink} href="/challenges">Challenges</ReactNav.Link>
          <ReactNav.Link className={styles.navLink} href="/apply">Apply</ReactNav.Link>
        </ReactNav>
        <span
          className="d-sm-none" // Hide above sm screens.
        >
          <hr className={styles.navUserInfoDivider} />
          {status === UserCurrentStatus.LoggedIn ? (
            <>
              <small className={`${styles.navUserInfo} text-muted`}>
                {user?.email}
              </small>
              <ReactNav.Link
                href={`/auth/logout?r=${
                  process.browser
                    ? window.location.pathname
                    : `${router.basePath}${router.asPath}`
                }`}
              >
                Logout
              </ReactNav.Link>
            </>
          ) : (
            <ReactNav.Link
              href={`/auth/login?r=${
                process.browser
                  ? window.location.pathname
                  : `${router.basePath}${router.asPath}`
              }`}
            >
              Login / Signup
            </ReactNav.Link>
          )}
        </span>
      </ReactNavbar.Collapse>
      <span
        className={`d-none d-sm-block text-right ${styles.navbarSpan}`} // Hide icon below sm screens.
      >
        {status === UserCurrentStatus.LoggedIn ? (
          navbarUserDropdown
        ) : (
          <a className={styles.navbarLoginLink}
            href={`/auth/login?r=${
              process.browser
                ? window.location.pathname
                : `${router.basePath}${router.asPath}`
            }`}
          >
            Login / Signup
          </a>
        )}
      </span>
    </ReactNavbar>
  );
};
