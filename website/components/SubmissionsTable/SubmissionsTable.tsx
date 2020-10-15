import * as dayjs from "dayjs";
import React from "react";
import { Button, Table } from "react-bootstrap";
import { Submission } from "../../libs/submissions-api";

const relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);

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
            <td>{val.score}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};
