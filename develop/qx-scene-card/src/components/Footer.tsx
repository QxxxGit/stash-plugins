import { GQL, React, libraries } from "../globals";
import { IStudio } from "../types/IStudio";

export const Footer: React.FC<{
	id: number;
	date?: string;
	views?: number;
	studio?: IStudio;
}> = ({ id, date, views, studio }) => {
	const { OverlayTrigger, Tooltip } = libraries.Bootstrap;
	const { Link } = libraries.ReactRouterDOM;
	const { FormattedDate } = libraries.Intl;
	const [fetchLastPlayed, { data }] = GQL.useFindSceneLazyQuery();

	const onTooltipEnter = () => {
		fetchLastPlayed({ variables: { id: id } });
	};

	const LastViewedTooltip = (props: any) => {
		if (!data?.findScene?.last_played_at)
			return <Tooltip {...props}>Error fetching last played</Tooltip>;

		return (
			<Tooltip {...props}>
				Last Viewed{" "}
				<FormattedDate
					value={data.findScene.last_played_at}
					format="long"
					timeZone="utc"
				/>
			</Tooltip>
		);
	};

	const RenderViewCount = () => {
		return <div>{(views === 1 && "1 view") || `${views} views`}</div>;
	};

	return (
		<div className="footer">
			<span className="studio">
				{studio && (
					<Link to={`/studios/${studio.id}`}>{studio.name}</Link>
				)}
			</span>
			<span className="views">
				{views && views > 0 ? (
					<OverlayTrigger
						placement="bottom"
						overlay={LastViewedTooltip}
						onEnter={onTooltipEnter}
						id="last-played-tooltip">
						{RenderViewCount()}
					</OverlayTrigger>
				) : (
					RenderViewCount()
				)}
			</span>
			<span className="date">
				{date && (
					<FormattedDate value={date} format="short" timeZone="utc" />
				)}
			</span>
		</div>
	);
};
