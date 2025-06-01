import * as React from "react";
import { Toaster as Sonner, toast as sonnerToast } from "sonner";

import { cn } from "@/lib/utils";

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className={cn(
        "fixed inset-x-0 bottom-0 z-[100] flex flex-col gap-2 p-4 md:bottom-auto md:right-0 md:top-0 md:max-w-[420px]"
      )}
      toastOptions={{
        classNames: {
          toast:
            "group pointer-events-auto relative flex w-full items-centre justify-between space-x-2 overflow-hidden rounded-md border p-4 pr-6 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
          description: "text-sm opacity-90",
          actionButton:
            "inline-flex h-8 shrink-0 items-centre justify-centre rounded-md border bg-transparent px-3 text-sm font-medium transition-colors hover:bg-secondary focus:outline-none focus:ring-1 focus:ring-ring disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive",
          cancelButton:
            "inline-flex h-8 shrink-0 items-centre justify-centre rounded-md border bg-transparent px-3 text-sm font-medium transition-colors hover:bg-secondary focus:outline-none focus:ring-1 focus:ring-ring disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }

// Export the toast function directly to fix the build warning
export const toast = sonnerToast;

export const useToast = () => {
  return {
    toast: (message: string, options?) => {
      console.log(message, options);
      // This is a simplified implementation
      // In a real app, this would use the actual toast library
      sonnerToast(message, options);
    },
    dismiss: (toastId?: string) => {
      console.log("Dismissed toast", toastId);
    },
  };
};
