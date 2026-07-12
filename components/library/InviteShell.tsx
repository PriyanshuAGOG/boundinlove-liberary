import type { CSSProperties, ReactNode } from "react";

type InviteShellProps = {
  children: ReactNode;
  className?: string;
  theme?: CSSProperties;
};

export function InviteShell({ children, className = "", theme }: InviteShellProps) {
  return (
    <main className={`invite-shell ${className}`} style={theme}>
      {children}
    </main>
  );
}

