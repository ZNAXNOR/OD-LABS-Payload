/**
 * Minimal HTML email wrapper shared by Payload authentication and form emails.
 * Uses inline styles for compatibility with common email clients.
 */

type WrapEmailHtmlOptions = {
  title: string;
  bodyHtml: string;
};

export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    };

    return entities[character];
  });
}

export function wrapEmailHtml({
  title,
  bodyHtml,
}: WrapEmailHtmlOptions): string {
  const safeTitle = escapeHtml(title);

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${safeTitle}</title>
  </head>
  <body style="margin:0;padding:0;background-color:#f4f4f2;color:#242424;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.6;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${safeTitle}</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4f4f2;width:100%;">
      <tr>
        <td align="center" style="padding:32px 16px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background-color:#ffffff;border:1px solid #e5e5e2;">
            <tr>
              <td style="padding:22px 28px;border-bottom:1px solid #e5e5e2;">
                <div style="font-size:18px;font-weight:700;letter-spacing:1.5px;color:#171717;">OD LABS</div>
              </td>
            </tr>
            <tr>
              <td style="padding:28px;">
                <h1 style="margin:0 0 20px;font-size:22px;line-height:1.3;font-weight:700;color:#171717;">${safeTitle}</h1>
                <div style="font-size:15px;line-height:1.7;color:#333333;">
                  ${bodyHtml}
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding:18px 28px;border-top:1px solid #e5e5e2;color:#666666;font-size:12px;line-height:1.5;">
                OD LABS · This message relates to your request or account.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}
