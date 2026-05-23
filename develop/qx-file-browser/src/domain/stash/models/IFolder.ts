export interface IFolder {
	id: string;
	path: string;
	basename: string;
	parent_folder?: IFolder;
	parent_folders?: IFolder[];
	sub_folders?: IFolder[];
	mod_time: string;
	created_time: string;
	updated_at: string;
}
