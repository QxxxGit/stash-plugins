import { components, libraries, React } from "../../globals";
import { usePerformerQuery } from "../../hooks/usePerformerQuery";
import { useSceneDate } from "../../hooks/useSceneDate";
import { IPerformer } from "../../types/IPerformer";
import TextUtils from "../../utils/text";

const PerformerHoverPopover: React.FC<{
	performers: IPerformer[];
	props: any;
}> = ({ performers, props }) => {
	const { Link } = libraries.ReactRouterDOM;
	const { Popover } = libraries.Bootstrap;
	const { useIntl } = libraries.Intl;
	const { LoadingIndicator } = components;
	const { loading, data } = usePerformerQuery(performers);
	const sceneDateContext = useSceneDate();
	const intl = useIntl();

	const getIntlStringForAgeContext = (age: number) => {
		const ageL10Id = sceneDateContext.date
			? "media_info.performer_card.age_context"
			: "media_info.performer_card.age";

		const ageL10String = intl.formatMessage({
			id: "years_old",
			defaultMessage: "years old",
		});

		const ageString = intl.formatMessage(
			{ id: ageL10Id },
			{ age, years_old: ageL10String }
		);

		return ageString;
	};

	const getPerformerAge = (performer: IPerformer) => {
		const performerResults = data?.findPerformers
			.performers as IPerformer[];

		if (!performerResults || loading) return null;

		const p = performerResults.find((p) => p.id === performer.id);
		if (!p?.birthdate) return null;

		const getAge = TextUtils.getAge(
			p.birthdate,
			sceneDateContext.date ?? p.death_date
		);
		return getIntlStringForAgeContext(getAge);
	};

	return (
		<Popover id="performer-popover-container" {...props}>
			<div className="flex-col">
				{(loading && (
					<div className="qx-loading-indicator">
						<LoadingIndicator />
					</div>
				)) ||
					performers?.map((p, i) => {
						return (
							<Link to={`/performers/${p.id}`}>
								<div className="performer-row">
									<img
										className="image-thumbnail"
										alt={p.name ?? ""}
										src={p.image_path ?? ""}
									/>
									<div className="performer-details">
										<div className={`name ${p.gender}`}>
											{p.name}
										</div>
										<div className="age">
											{getPerformerAge(p)}
										</div>
									</div>
								</div>
							</Link>
						);
					})}
			</div>
		</Popover>
	);
};

export default PerformerHoverPopover;
