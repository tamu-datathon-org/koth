import dayjs from "dayjs";
import React from "react";
import { Table } from "react-bootstrap";
import { Submission, SubmissionStatus } from "../../libs/submissions-api";
import styles from "./submissions-table.module.scss";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

export const statusStyleMap = (status: SubmissionStatus): any => {
  switch (status) {
    case "SUBMITTED":
      return styles.submitted;
    case "IN_PROGRESS":
      return styles.inProgress;
    case "SUCCESS":
      return styles.success;
    case "FAILED":
      return styles.error;
    default:
      return styles.defaultStatus;
  }
};

export interface SubmissionsTableProps {
  submissions: Submission[];
  showStatus?: boolean;
  showSubmissionLinks?: boolean;
}

export const SubmissionsTable: React.FC<SubmissionsTableProps> = ({
  submissions,
  showStatus,
  showSubmissionLinks,
}) => {
  return (
    <Table striped bordered>
      <thead>
        <tr>
          <th>#</th>
          <th>Submission Time</th>

          {showStatus ? <th>Status</th> : <></>}

          <th>Score</th>
        </tr>
      </thead>
      <tbody>
        {submissions.map((val, idx) => (
          <tr key={idx}>
            <td>
              <a
                {...(showSubmissionLinks ? { href: `/koth/submissions/${val.id}` } : {})}
              >
                {idx + 1}
              </a>
            </td>
            <td>{dayjs(val.creationTimestamp).fromNow()}</td>

            {showStatus ? (
              <td className={statusStyleMap(val.status)}>{val.status}</td>
            ) : (
              <></>
            )}

            <td>{Number(val.score).toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};
