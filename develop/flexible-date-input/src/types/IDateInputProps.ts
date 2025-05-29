interface IDateInputProps {
	disabled?: boolean;
	value: string;
	isTime?: boolean;
	onValueChange(value: string): void;
	placeholder?: string;
	error?: string;
}

export default IDateInputProps;
