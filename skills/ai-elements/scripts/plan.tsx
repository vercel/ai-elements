"use client";

import {
  Plan,
  PlanAction,
  PlanContent,
  PlanDescription,
  PlanFooter,
  PlanHeader,
  PlanTitle,
  PlanTrigger,
} from "@/components/ai-elements/plan";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

const Example = () => (
  <Plan defaultOpen={false}>
    <PlanHeader>
      <div>
        <div className="mb-4 flex items-center gap-2">
          <FileText className="size-4" />
          <PlanTitle>Rewrite AI Elements to SolidJS</PlanTitle>
        </div>
        <PlanDescription>
          Rewrite the AI Elements component library from React to SolidJS while
          maintaining compatibility with existing React-based shadcn/ui
          components using solid-js/compat, updating all 29 components and their
          test suite.
        </PlanDescription>
      </div>
      <PlanTrigger />
    </PlanHeader>
    <PlanContent>
      <div className="space-y-4 text-sm">
        <div>
          <h3 className="mb-2 font-semibold">Overview</h3>
          <p>
            This plan outlines the migration strategy for converting the AI
            Elements library from React to SolidJS, ensuring compatibility and
            maintaining existing functionality.
          </p>
        </div>
        <div>
          <h3 className="mb-2 font-semibold">Key Steps</h3>
          <ul className="list-inside list-disc space-y-1">
            <li>Set up SolidJS project structure</li>
            <li>Install solid-js/compat for React compatibility</li>
            <li>Migrate components one by one</li>
            <li>Update test suite for each component</li>
            <li>Verify compatibility with shadcn/ui</li>
          </ul>
        </div>
      </div>
    </PlanContent>
    <PlanFooter className="justify-end">
      <PlanAction>
        <Button size="sm">
          Build <kbd className="font-mono">⌘↩</kbd>
        </Button>
      </PlanAction>
    </PlanFooter>
  </Plan>
);

export default Example;
