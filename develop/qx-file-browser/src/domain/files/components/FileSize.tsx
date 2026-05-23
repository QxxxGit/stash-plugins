import { libraries, React } from "../../../globals";
import { FileUtils } from "../utils/FileUtils";

export const FileSize: React.FC<{ size: number }> = ({ size: fileSize }) => {
	const { size, unit } = FileUtils.FileSize(fileSize);
	const { FormattedNumber } = libraries.Intl;

	return (
		<>
			<FormattedNumber
				value={size}
				maximumFractionDigits={FileUtils.FileSizeFractionalDigits(unit)}
			/>
			{` ${FileUtils.FormatFileSizeUnit(unit)}`}
		</>
	);
};
