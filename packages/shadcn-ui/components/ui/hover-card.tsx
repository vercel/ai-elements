"use client"

import * as React from "react"
import { cva } from "class-variance-authority"
import { HoverCard as HoverCardPrimitive } from "radix-ui"
import { cn } from "@repo/shadcn-ui/lib/utils"

/**
 * Additional padding added to the bridge area to prevent the hover card from closing
 * when the mouse moves through the gap between the trigger and content.
 * This creates a slightly larger hover zone than the actual sideOffset.
 */
const BRIDGE_TOLERANCE = 4

/**
 * Bridge variant styles that create an invisible hover area between the trigger and content.
 * This prevents the card from closing when the mouse moves through the gap.
 * The bridge uses a ::before pseudo-element positioned based on the card's side.
 */
const bridgeVariants = cva(
  "relative before:absolute before:pointer-events-auto before:z-[-1]",
  {
    variants: {
      enabled: {
        true: [
          // Position the bridge on the side facing the trigger
          "data-[side=bottom]:before:bottom-full",
          "data-[side=top]:before:top-full",
          "data-[side=left]:before:left-full",
          "data-[side=right]:before:right-full",
          // Horizontal positioning for bottom/top sides (full width)
          "data-[side=bottom]:before:left-0",
          "data-[side=bottom]:before:right-0",
          "data-[side=top]:before:left-0",
          "data-[side=top]:before:right-0",
          // Vertical positioning for left/right sides (full height)
          "data-[side=left]:before:top-0",
          "data-[side=left]:before:bottom-0",
          "data-[side=right]:before:top-0",
          "data-[side=right]:before:bottom-0",
          // Size based on side: height for bottom/top, width for left/right
          "data-[side=bottom]:before:h-(--bridge-offset)",
          "data-[side=top]:before:h-(--bridge-offset)",
          "data-[side=left]:before:w-(--bridge-offset)",
          "data-[side=right]:before:w-(--bridge-offset)",
        ],
        false: "",
      },
    },
    defaultVariants: {
      enabled: false,
    },
  }
)

function HoverCard({
  ...props
}: React.ComponentProps<typeof HoverCardPrimitive.Root>) {
  return <HoverCardPrimitive.Root data-slot="hover-card" {...props} />
}

function HoverCardTrigger({
  ...props
}: React.ComponentProps<typeof HoverCardPrimitive.Trigger>) {
  return (
    <HoverCardPrimitive.Trigger data-slot="hover-card-trigger" {...props} />
  )
}

function HoverCardContent({
  className,
  align = "center",
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof HoverCardPrimitive.Content>) {
  // Only create a bridge when there's a gap between trigger and content
  const needsBridge = sideOffset > 0

  // Set CSS variable for bridge size: sideOffset + tolerance
  // This ensures the bridge area is slightly larger than the gap to prevent premature closing
  const style = needsBridge
    ? ({
        "--bridge-offset": `${sideOffset + BRIDGE_TOLERANCE}px`,
      } as React.CSSProperties)
    : undefined

  return (
    <HoverCardPrimitive.Portal data-slot="hover-card-portal">
      <HoverCardPrimitive.Content
        data-slot="hover-card-content"
        align={align}
        sideOffset={sideOffset}
        style={style}
        className={cn(
          "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-64 origin-(--radix-hover-card-content-transform-origin) rounded-md border p-4 shadow-md outline-hidden",
          bridgeVariants({ enabled: needsBridge }),
          className
        )}
        {...props}
      />
    </HoverCardPrimitive.Portal>
  )
}

export { HoverCard, HoverCardTrigger, HoverCardContent }
