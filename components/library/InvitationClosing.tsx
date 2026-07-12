type InvitationClosingProps = {
  message?: string;
  signature?: string;
  showFactoryCredit?: boolean;
  factoryUrl?: string | null;
};

export function InvitationClosing({ message = "We cannot wait to celebrate with you.", signature, showFactoryCredit = true, factoryUrl }: InvitationClosingProps) {
  return (
    <footer className="invite-closing">
      <p className="invite-display">{message}</p>
      {signature && <p className="invite-closing__signature">{signature}</p>}
      {showFactoryCredit && (
        <a href={factoryUrl || "#"} className="invite-closing__credit">Made with Invitation Website Factory</a>
      )}
    </footer>
  );
}

