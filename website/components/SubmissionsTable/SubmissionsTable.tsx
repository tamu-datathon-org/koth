import * as dayjs from "dayjs";
import React from "react";
import { Button, Table } from "react-bootstrap";
import { Submission } from "../../libs/submissions-api";
import styles from "./submissions-table.module.scss";
const relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);

const statusStyleMap = (status: string): any => {
  switch (status) {
    case "SUBMITTED":
      return styles.submitted;
    case "IN_PROGRESS":
      return styles.inProgress;
    case "SUCCESS":
      return styles.success;
    case "ERROR":
      return styles.error;
    default:
      return styles.defaultStatus;
  }
};

export interface SubmissionsTableProps {
  submissions: Submission[];
}

export const SubmissionsTable: React.FC<SubmissionsTableProps> = ({
  submissions,
}) => {
  const sortedSubmissions = submissions.sort((a, b) =>
    a.creationTimestamp > b.creationTimestamp ? -1 : 1
  );

  return (
    <Table striped bordered>
      <thead>
        <tr>
          <th>#</th>
          <th>Submission Time</th>
          <th>Status</th>
          <th>Score</th>
        </tr>
      </thead>
      <tbody>
        {sortedSubmissions.map((val, idx) => (
          <tr>
            <td>
              <Button
                target="_blank"
                href={`/koth/submissions/${val.id}`}
                variant="link"
              >
                {idx + 1}
              </Button>
            </td>
            <td>{dayjs.unix(val.creationTimestamp).fromNow()}</td>
            <td className={statusStyleMap(val.status)}>{val.status}</td>
            <td>{val.score}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};
