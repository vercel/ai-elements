"use client";

import {
  Artifact,
  ArtifactAction,
  ArtifactActions,
  ArtifactContent,
  ArtifactDescription,
  ArtifactHeader,
  ArtifactTitle,
} from "@/components/ai-elements/artifact";
import { CodeBlock } from "@/components/ai-elements/code-block";
import {
  CopyIcon,
  DownloadIcon,
  PlayIcon,
  RefreshCwIcon,
  ShareIcon,
} from "lucide-react";

const handleRun = () => {
  console.log("Run");
};

const handleCopy = () => {
  console.log("Copy");
};

const handleRegenerate = () => {
  console.log("Regenerate");
};

const handleDownload = () => {
  console.log("Download");
};

const handleShare = () => {
  console.log("Share");
};

const code = `# Dijkstra's Algorithm implementation
import heapq

def dijkstra(graph, start):
    distances = {node: float('inf') for node in graph}
    distances[start] = 0
    heap = [(0, start)]
    visited = set()
    
    while heap:
        current_distance, current_node = heapq.heappop(heap)
        if current_node in visited:
            continue
        visited.add(current_node)
        
        for neighbor, weight in graph[current_node].items():
            distance = current_distance + weight
            if distance < distances[neighbor]:
                distances[neighbor] = distance
                heapq.heappush(heap, (distance, neighbor))
    
    return distances

# Example graph
 graph = {
    'A': {'B': 1, 'C': 4},
    'B': {'A': 1, 'C': 2, 'D': 5},
    'C': {'A': 4, 'B': 2, 'D': 1},
    'D': {'B': 5, 'C': 1}
}

print(dijkstra(graph, 'A'))`;

const Example = () => (
  <Artifact>
    <ArtifactHeader>
      <div>
        <ArtifactTitle>Dijkstra&apos;s Algorithm Implementation</ArtifactTitle>
        <ArtifactDescription>Updated 1 minute ago</ArtifactDescription>
      </div>
      <div className="flex items-center gap-2">
        <ArtifactActions>
          <ArtifactAction
            icon={PlayIcon}
            label="Run"
            onClick={handleRun}
            tooltip="Run code"
          />
          <ArtifactAction
            icon={CopyIcon}
            label="Copy"
            onClick={handleCopy}
            tooltip="Copy to clipboard"
          />
          <ArtifactAction
            icon={RefreshCwIcon}
            label="Regenerate"
            onClick={handleRegenerate}
            tooltip="Regenerate content"
          />
          <ArtifactAction
            icon={DownloadIcon}
            label="Download"
            onClick={handleDownload}
            tooltip="Download file"
          />
          <ArtifactAction
            icon={ShareIcon}
            label="Share"
            onClick={handleShare}
            tooltip="Share artifact"
          />
        </ArtifactActions>
      </div>
    </ArtifactHeader>
    <ArtifactContent className="p-0">
      <CodeBlock
        className="border-none"
        code={code}
        language="python"
        showLineNumbers
      />
    </ArtifactContent>
  </Artifact>
);

export default Example;
