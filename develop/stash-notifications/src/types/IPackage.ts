interface IPackage {
	name: string;
	package_id: string;
	date: Date;
	sourceURL: string;
	source_package?: IPackage;
	version: string;
}

export default IPackage;
