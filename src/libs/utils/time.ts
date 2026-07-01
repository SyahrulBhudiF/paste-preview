export const formatExpiry = (expiresAt: string, now = new Date()) => {
	const expires = new Date(expiresAt);
	const diffMs = expires.getTime() - now.getTime();
	const exact = new Intl.DateTimeFormat("en", {
		month: "short",
		day: "numeric",
		year: "numeric",
	}).format(expires);

	if (diffMs <= 0) return `Expired (${exact})`;

	const hours = Math.floor(diffMs / (60 * 60 * 1000));
	if (hours < 1) return `Expires soon (${exact})`;
	if (hours < 24) return `Expires in ${hours} ${hours === 1 ? "hour" : "hours"} (${exact})`;

	const days = Math.ceil(diffMs / (24 * 60 * 60 * 1000));
	return `Expires in ${days} ${days === 1 ? "day" : "days"} (${exact})`;
};
