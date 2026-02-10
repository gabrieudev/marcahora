interface VerificationEmailProps {
  url: string;
}

export function VerificationEmail({ url }: VerificationEmailProps) {
  const styles: { [k: string]: React.CSSProperties } = {
    body: {
      margin: 0,
      padding: 0,
      backgroundColor: "#f4f6f8",
      fontFamily: "Helvetica, Arial, sans-serif",
      color: "#333333",
    },
    fullWidthTable: {
      width: "100%",
      backgroundColor: "#f4f6f8",
      padding: "24px 0",
    },
    container: {
      maxWidth: 600,
      width: "100%",
      margin: "0 auto",
      backgroundColor: "#ffffff",
      borderRadius: 10,
      overflow: "hidden",
      boxShadow: "0 2px 6px rgba(16,24,40,0.08)",
    },
    header: {
      padding: "28px 32px",
      textAlign: "center" as const,
      borderBottom: "1px solid #e9eef2",
    },
    logo: {
      display: "block",
      margin: "0 auto 12px",
      width: 64,
      height: 64,
      objectFit: "contain" as const,
    },
    title: {
      margin: "0 0 6px",
      fontSize: 22,
      lineHeight: "28px",
      color: "#0f172a",
    },
    lead: {
      margin: 0,
      fontSize: 14,
      lineHeight: "20px",
      color: "#475569",
    },
    content: {
      padding: "28px 32px",
      textAlign: "center" as const,
    },
    button: {
      display: "inline-block",
      textDecoration: "none",
      padding: "12px 22px",
      borderRadius: 8,
      backgroundColor: "#2563eb",
      color: "#ffffff",
      fontWeight: 600,
      marginTop: 20,
      marginBottom: 20,
    },
    note: {
      fontSize: 12,
      color: "#64748b",
      margin: "12px 0 6px",
      wordBreak: "break-word" as const,
    },
    fallbackLink: {
      fontSize: 12,
      color: "#2563eb",
      wordBreak: "break-all" as const,
    },
    footer: {
      padding: "18px 32px",
      fontSize: 12,
      color: "#94a3b8",
      borderTop: "1px solid #e9eef2",
      textAlign: "center" as const,
    },
    preheader: {
      display: "none",
      fontSize: 1,
      color: "#ffffff",
      lineHeight: "1px",
      maxHeight: 0,
      maxWidth: 0,
      opacity: 0,
      overflow: "hidden",
    },
  };

  return (
    <html lang="pt-BR">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>Confirme seu e-mail</title>
      </head>

      <body style={styles.body}>
        {/* Preheader: aparece como preview em muitos clientes de e-mail */}
        <span style={styles.preheader}>
          Confirme seu e-mail para ativar sua conta — clique no botão abaixo.
        </span>

        <table
          role="presentation"
          cellPadding={0}
          cellSpacing={0}
          style={styles.fullWidthTable}
        >
          <tbody>
            <tr>
              <td align="center">
                <table
                  role="presentation"
                  cellPadding={0}
                  cellSpacing={0}
                  width="100%"
                  style={styles.container as any}
                >
                  <tbody>
                    <tr>
                      <td style={styles.header}>
                        <img
                          src="../images/logo.png"
                          alt="Logo"
                          width={64}
                          height={64}
                          style={styles.logo}
                        />
                        <h1 style={styles.title}>Confirme seu e-mail</h1>
                        <p style={styles.lead}>
                          Só falta um passo — confirme seu endereço de e-mail.
                        </p>
                      </td>
                    </tr>

                    <tr>
                      <td style={styles.content}>
                        <p style={{ margin: 0, color: "#334155" }}>
                          Para ativar sua conta, clique no botão abaixo:
                        </p>

                        <a
                          href={url}
                          style={styles.button}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Verificar meu e-mail
                        </a>

                        <p style={styles.note}>
                          Se o botão não abrir, copie e cole este link no seu
                          navegador:
                        </p>

                        <p style={styles.fallbackLink}>
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: "inherit", textDecoration: "none" }}
                          >
                            {url}
                          </a>
                        </p>
                      </td>
                    </tr>

                    <tr>
                      <td style={styles.footer}>
                        <div>
                          Se você não solicitou este e-mail, pode ignorá-lo —
                          nenhuma ação será tomada.
                        </div>
                        <div style={{ marginTop: 8 }}>
                          © {new Date().getFullYear()} Sua Aplicação
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </body>
    </html>
  );
}
