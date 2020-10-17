import { useState } from "react";
import { Button, Container, Form, Modal } from "react-bootstrap";

export interface SubmissionModalProps {
  show: boolean;
  onHide: any;
  onSubmit: any;
}

export interface SubmissionModalOutput {
  submissionFile?: File | null;
}

export const SubmissionModal: React.FC<SubmissionModalProps> = ({
  show,
  onHide,
  onSubmit,
}) => {
  const [output, setOutput] = useState<SubmissionModalOutput>({});
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
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const submissionFile =
                e.target.files == null ? null : e.target.files[0];
              setOutput({
                submissionFile,
                ...output,
              });
            }}
          />
        </Form>
      </Container>

      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onHide}>
          Close
        </Button>
        <Button
          variant="primary"
          onClick={() => onSubmit(output)}
          style={{ backgroundColor: "#7c408a" }}
        >
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
