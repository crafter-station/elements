"use client";

import * as React from "react";

import {
  AiConfirmation,
  AiConfirmationAccepted,
  AiConfirmationAction,
  AiConfirmationActions,
  AiConfirmationRejected,
  AiConfirmationRequest,
} from "@/registry/default/blocks/ai/ai-confirmation/components/elements/ai-confirmation";

export default function AiConfirmationDemo() {
  const [state1, setState1] = React.useState<
    | "approval-requested"
    | "approval-responded"
    | "output-available"
    | "output-denied"
  >("approval-requested");

  const [state2] = React.useState<
    | "approval-requested"
    | "approval-responded"
    | "output-available"
    | "output-denied"
  >("output-available");

  const [state3] = React.useState<
    | "approval-requested"
    | "approval-responded"
    | "output-available"
    | "output-denied"
  >("output-denied");

  return (
    <div className="w-full max-w-xl space-y-4 p-4">
      <AiConfirmation
        state={state1}
        onApprove={() => setState1("output-available")}
        onReject={() => setState1("output-denied")}
      >
        <AiConfirmationRequest
          title="Delete user account"
          description="This will permanently delete the user account and all associated data."
        >
          <AiConfirmationActions>
            <AiConfirmationAction variant="reject">Reject</AiConfirmationAction>
            <AiConfirmationAction variant="approve">
              Approve
            </AiConfirmationAction>
          </AiConfirmationActions>
        </AiConfirmationRequest>
        <AiConfirmationAccepted>
          User account deleted successfully.
        </AiConfirmationAccepted>
        <AiConfirmationRejected>
          Action cancelled by user.
        </AiConfirmationRejected>
      </AiConfirmation>

      <AiConfirmation state={state2}>
        <AiConfirmationAccepted>
          File uploaded successfully to /documents/report.pdf
        </AiConfirmationAccepted>
      </AiConfirmation>

      <AiConfirmation state={state3}>
        <AiConfirmationRejected>
          Database migration was rejected.
        </AiConfirmationRejected>
      </AiConfirmation>
    </div>
  );
}
