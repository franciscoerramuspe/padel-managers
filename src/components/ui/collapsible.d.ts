import * as React from "react"

declare const Collapsible: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLDivElement> & { open?: boolean; defaultOpen?: boolean; onOpenChange?: (open: boolean) => void }>
declare const CollapsibleTrigger: React.ForwardRefExoticComponent<React.ButtonHTMLAttributes<HTMLButtonElement>>
declare const CollapsibleContent: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLDivElement>>

export {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} 