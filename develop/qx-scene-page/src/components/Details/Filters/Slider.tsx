import { FormattedMessage, libraries, React } from "../../../globals";
import { IFilter, ISliderRange } from "../../../types/ISceneFilter";

const Slider: React.FC<{
	title: string;
	className?: string;
	filter: IFilter;
	setValue: (value: React.SetStateAction<number>) => void;
	displayValue: string;
}> = ({ title, className, filter, setValue, displayValue }) => {
	const { Form } = libraries.Bootstrap;

	return (
		<div className="row form-group">
			<span className="col-sm-3">{title}</span>
			<span className="col-sm-6">
				<Form.Control
					className={`filter-slider d-inline-flex ml-sm-3 ${className}`}
					type="range"
					min={filter.slider.min}
					max={filter.slider.max}
					value={filter.value}
					onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
						
						setValue(Number.parseInt(e.currentTarget.value, 10));
					}}
				/>
			</span>
			<span
				className="col-sm-3 filter-slider-value"
				role="presentation"
				onClick={() => setValue(range.default)}
			>
				{displayValue}
			</span>
		</div>
	);
};

export default Slider;
