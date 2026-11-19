import nodemailer from 'nodemailer';
import { dev } from '$app/env';
import { EMAIL_FROM, SMTP_URL } from '$app/env/private';
import { m } from '#lib/paraglide/messages.js';

/**
 * SMTP transport, created once from SMTP_URL (an smtp(s):// connection string).
 * When SMTP_URL is absent (e.g. local dev) the app keeps working — emails are
 * logged to the console instead of sent.
 */
const transporter = SMTP_URL ? nodemailer.createTransport(SMTP_URL) : null;

type SendEmail = {
	to: string;
	subject: string;
	text: string;
	html?: string;
};

/** Low-level send. Throws when SMTP is configured but the send fails. */
export async function sendEmail({ to, subject, text, html }: SendEmail) {
	if (!transporter) {
		console.info(
			`[email] SMTP_URL not configured — skipping send to ${to}: ${subject}\n${text}`
		);
		return;
	}
	await transporter.sendMail({
		from: EMAIL_FROM || 'Christmas Gifts <no-reply@localhost>',
		to,
		subject,
		text,
		html: html ?? undefined,
	});
}

export type InviteEmail = {
	to: string;
	name: string;
	username: string;
	familyName: string;
	inviterName: string;
	/** Base URL of the app, so the invitee knows where to sign in. */
	origin: string;
};

/** Sent when an admin adds a new member to a family. */
export async function sendInviteEmail({
	to,
	name,
	username,
	familyName,
	inviterName,
	origin,
}: InviteEmail) {
	const subject = m.email_invite_subject({ family: familyName });
	const text = [
		m.email_invite_greeting({ name }),
		'',
		m.email_invite_body({ inviter: inviterName, family: familyName, url: origin, username }),
		'',
		m.email_invite_signoff(),
	].join('\n');
	const html = `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f5f3;padding:32px 16px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
	<tr>
		<td align="center">
			<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e4e2dd;">
				<tr><td style="background:#c43b3b;height:6px;"></td></tr>
				<tr>
					<td style="padding:28px 32px;color:#2b2a28;font-size:15px;line-height:1.55;">
						<p style="margin:0 0 16px;"><strong>${m.email_invite_greeting({ name })}</strong></p>
						<p style="margin:0 0 16px;">${m.email_invite_body({ inviter: inviterName, family: familyName, url: origin, username })}</p>
						<p style="margin:0 0 16px;background:#f6f5f3;border-radius:8px;padding:12px 16px;font-family:ui-monospace,Menlo,monospace;font-size:14px;">${username}</p>
						<p style="margin:0 0 0;"><a href="${origin}" style="color:#c43b3b;font-weight:600;text-decoration:none;">${origin}</a></p>
					</td>
				</tr>
				<tr>
					<td style="padding:20px 32px;border-top:1px solid #e4e2dd;color:#8a8781;font-size:13px;">
						${m.email_invite_signoff()} — ${dev ? 'dev' : 'Christmas Gifts'}
					</td>
				</tr>
			</table>
		</td>
	</tr>
</table>`;
	await sendEmail({ to, subject, text, html });
}
