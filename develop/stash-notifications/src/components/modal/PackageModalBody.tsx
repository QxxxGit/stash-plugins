import { libraries, React } from "../../globals";
import IPackage from "../../types/IPackage";

const PackageModalBody: React.FC<{
	pkg: IPackage;
}> = ({ pkg }) => {
	const { FormattedDate, FormattedTime } = libraries.Intl;

	return (
		<>
			<div>
				<h4>{pkg.name}</h4>
				<div>id: {pkg.package_id}</div>
				<div>source url: {pkg.sourceURL}</div>
			</div>
			<div>
				<h5>Current Version ({pkg.version})</h5>
				<div>
					Last updated:{" "}
					<FormattedDate
						value={pkg.date}
						format="short"
						timeZone="utc"
					/>{" "}
					<FormattedTime
						value={pkg.date}
						hour="numeric"
						minute="numeric"
						second="numeric"
						timeZone="utc"
					/>
				</div>
			</div>
			<div>
				<h5>Latest Version ({pkg.source_package?.version})</h5>
				<div>
					Remote version updated:{" "}
					<FormattedDate
						value={pkg.source_package?.date}
						format="short"
						timeZone="utc"
					/>{" "}
					<FormattedTime
						value={pkg.source_package?.date}
						hour="numeric"
						minute="numeric"
						second="numeric"
						timeZone="utc"
					/>
				</div>
			</div>
		</>
	);
};

export default PackageModalBody;
