import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// Define avatar variants using class-variance-authority
const avatarVariants = cva(
  "relative flex shrink-0 overflow-hidden rounded-full",
  {
    variants: {
      size: {
        xs: "h-6 w-6",
        sm: "h-8 w-8",
        md: "h-10 w-10",
        lg: "h-12 w-12",
        xl: "h-16 w-16",
        "2xl": "h-20 w-20",
      },
      variant: {
        default: "bg-muted",
        outline: "border-2 border-border bg-background",
        solid: "bg-primary text-primary-foreground",
      },
      status: {
        online: "ring-2 ring-green-500",
        offline: "ring-2 ring-gray-400",
        busy: "ring-2 ring-red-500",
        away: "ring-2 ring-yellow-500",
        none: "",
      },
    },
    defaultVariants: {
      size: "md",
      variant: "default",
      status: "none",
    },
  }
);

// Avatar component props
interface AvatarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarVariants> {
  src?: string;
  alt?: string;
  fallback?: React.ReactNode;
  fallbackDelay?: number;
}

// Avatar component
const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  (
    {
      className,
      src,
      alt,
      fallback,
      fallbackDelay = 600,
      size,
      variant,
      status,
      ...props
    },
    ref
  ) => {
    const [imageError, setImageError] = React.useState(false);
    const [showFallback, setShowFallback] = React.useState(!src);

    React.useEffect(() => {
      if (!src) {
        setShowFallback(true);
        return;
      }

      setShowFallback(false);
      setImageError(false);

      const timer = setTimeout(() => {
        if (imageError) {
          setShowFallback(true);
        }
      }, fallbackDelay);

      return () => clearTimeout(timer);
    }, [src, imageError, fallbackDelay]);

    return (
      <div
        ref={ref}
        className={cn(avatarVariants({ size, variant, status, className }))}
        {...props}
      >
        {!showFallback && src && (
          <img
            src={src}
            alt={alt || "Avatar"}
            className="h-full w-full object-cover"
            onError={() => setImageError(true)}
          />
        )}
        {showFallback && (
          <div className="flex h-full w-full items-center justify-center bg-muted">
            {fallback || (
              <span className="text-foreground font-medium">
                {alt ? getInitials(alt) : "?"}
              </span>
            )}
          </div>
        )}
      </div>
    );
  }
);

Avatar.displayName = "Avatar";

// Helper function to get initials from a name
function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
}

// Avatar Image component
const AvatarImage = React.forwardRef<
  HTMLImageElement,
  React.ImgHTMLAttributes<HTMLImageElement>
>(({ className, alt, ...props }, ref) => {
  return (
    <img
      ref={ref}
      className={cn("h-full w-full object-cover", className)}
      alt={alt || "Avatar"}
      {...props}
    />
  );
});

AvatarImage.displayName = "AvatarImage";

// Avatar Fallback component
const AvatarFallback = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex h-full w-full items-center justify-center bg-muted",
        className
      )}
      {...props}
    >
      {children || <span className="text-foreground font-medium">?</span>}
    </div>
  );
});

AvatarFallback.displayName = "AvatarFallback";

// Avatar Group component for displaying multiple avatars
interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  avatars: Array<Omit<AvatarProps, "className">>;
  max?: number;
  size?: VariantProps<typeof avatarVariants>["size"];
  variant?: VariantProps<typeof avatarVariants>["variant"];
}

const AvatarGroup = React.forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ className, avatars, max = 4, size = "md", variant = "default", ...props }, ref) => {
    const visibleAvatars = avatars.slice(0, max);
    const remainingCount = Math.max(0, avatars.length - max);

    return (
      <div
        ref={ref}
        className={cn("flex -space-x-2", className)}
        {...props}
      >
        {visibleAvatars.map((avatar, index) => (
          <Avatar
            key={index}
            size={size}
            variant={variant}
            className="ring-2 ring-background"
            {...avatar}
          />
        ))}
        {remainingCount > 0 && (
          <div
            className={cn(
              avatarVariants({ size, variant }),
              "ring-2 ring-background flex items-center justify-center bg-muted"
            )}
          >
            <span className="text-xs font-medium text-foreground">
              +{remainingCount}
            </span>
          </div>
        )}
      </div>
    );
  }
);

AvatarGroup.displayName = "AvatarGroup";

export { Avatar, AvatarGroup, AvatarImage, AvatarFallback, avatarVariants };
