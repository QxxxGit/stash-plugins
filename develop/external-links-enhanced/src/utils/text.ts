const sanitiseURL = (url?: string, siteURL?: URL) => {
	if (!url) {
		return url;
	}

	if (url.startsWith("http://") || url.startsWith("https://")) {
		// just return the entire URL
		return url;
	}

	if (siteURL) {
		// if url starts with the site host, then prepend the protocol
		if (url.startsWith(siteURL.host)) {
			return `${siteURL.protocol}//${url}`;
		}

		// otherwise, construct the url from the protocol, host and passed url
		return `${siteURL.protocol}//${siteURL.host}/${url}`;
	}

	// just prepend the protocol - assume https
	return `https://${url}`;
};

export const TextUtils = {
	sanitiseURL,
};
