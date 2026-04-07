import { React } from "../globals";
import IDateInputProps from "../types/IDateInputProps";

const DateInputHelper: React.FC<IDateInputProps> = ({
	error,
	value,
	onValueChange,
}) => {
	if (!error) return null;

	const extractDateParts = (regex: RegExp) => {
		const match = value.match(regex);
		if (!match) return null;

		let [, year, month, day] = match;

		// normalize to 2 digits
		month = month.padStart(2, "0");
		day = day.padStart(2, "0");

		return { year, month, day };
	};

	const format = () => {
		const datePatterns = [
			/^(\d{4})(\d{2})(\d{2})$/, // compact format: 20260407
			/^(\d{4})年(\d{1,2})月(\d{1,2})日$/, // Japanese format: 2026年04月07日
		];

		for (const regex of datePatterns) {
			const parts = extractDateParts(regex);

			if (parts) {
				return `${parts.year}-${parts.month}-${parts.day}`;
			}
		}

		const trimmedValue = value.trim();
		const isEpoch = /^\d+$/.test(trimmedValue);
		const date = isEpoch
			? new Date(Number(trimmedValue))
			: new Date(trimmedValue);

		if (!isNaN(date.getTime())) {
			const year = date.getFullYear();
			const month = String(date.getMonth() + 1).padStart(2, "0");
			const day = String(date.getDate()).padStart(2, "0");

			return `${year}-${month}-${day}`;
		}

		return null;
	};

	const attemptToFix = () => {
		const newValue = format();

		if (newValue) {
			onValueChange(newValue);
		}
	};

	return (
		<div style={{ fontSize: ".875em" }}>
			<a
				href="#"
				onClick={(e) => {
					e.preventDefault();
					attemptToFix();
				}}
				role="button"
				tabIndex={0}>
				Attempt to fix?
			</a>
		</div>
	);
};

export default DateInputHelper;
