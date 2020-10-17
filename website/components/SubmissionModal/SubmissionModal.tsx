import { useState } from "react";
import { Button, Container, Form, Modal } from "react-bootstrap";

export interface SubmissionModalProps {
  show: boolean;
  onHide: any;
  onSubmit: any;
}

export interface SubmissionModalOutput {
  submissionFile?: File | null;
  entrypointFile?: string;
}

export const SubmissionModal: React.FC<SubmissionModalProps> = ({
  show,
  onHide,
  onSubmit,
}) => {
  const [submissionFile, setSubmissionFile] = useState<File | null>(null);
  const [entrypointFile, setEntrypointFile] = useState("main.py");
  const [submitting, setSubmitting] = useState(false);
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Add New Submission</Modal.Title>
      </Modal.Header>

      <Container style={{ margin: "30px auto" }}>
        <Form>
          <Form.File
            id="submission-file"
            label="Upload your submission file."
            className={`mb-3`}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const submissionFile =
                e.target.files == null ? null : e.target.files[0];
              setSubmissionFile(submissionFile);
            }}
          />

          <Form.Group controlId="formEntrypointFile">
            <Form.Label>Please enter the entrypoint file:</Form.Label>
            <Form.Control
              type="text"
              placeholder="main.py"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setEntrypointFile(e.target.value);
              }}
            />
          </Form.Group>
        </Form>
      </Container>

      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onHide}>
          Close
        </Button>
        <Button
          variant="primary"
          onClick={() => {
            onSubmit({ submissionFile, entrypointFile });
            setSubmitting(true);
          }}
          style={{ backgroundColor: "#7c408a" }}
          disabled={submitting}
        >
          {submitting ? "Submitting..." : "Submit"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
