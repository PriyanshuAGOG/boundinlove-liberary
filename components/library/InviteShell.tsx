import type { CSSProperties, ReactNode, Ref } from "react";

type InviteShellProps = {
  children: ReactNode;
  className?: string;
  theme?: CSSProperties;
  rootRef?: Ref<HTMLElement>;
};

export function InviteShell({ children, className = "", theme, rootRef }: InviteShellProps) {
  return (
    <main ref={rootRef} className={`invite-shell ${className}`} style={theme}>
      {children}
    </main>
  );
}

