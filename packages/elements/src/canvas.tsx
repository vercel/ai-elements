import { Background, ReactFlow, type ReactFlowProps } from "@xyflow/react";
import type { ReactNode } from "react";

type CanvasProps = ReactFlowProps & {
  children: ReactNode;
};

export const Canvas = ({ children, ...props }: CanvasProps) => (
  <ReactFlow
    deleteKeyCode={["Backspace", "Delete"]}
    fitView
    panOnDrag={false}
    panOnScroll
    selectionOnDrag={true}
    zoomOnDoubleClick={false}
    {...props}
  >
    <Background />
    {children}
  </ReactFlow>
);
