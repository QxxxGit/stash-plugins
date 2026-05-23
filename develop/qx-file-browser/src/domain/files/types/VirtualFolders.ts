export const VIRTUAL_FOLDER_IDS = [
	"favorites",
	"library",
	"recent",
	"trash",
] as const;

export type VirtualFolderId = (typeof VIRTUAL_FOLDER_IDS)[number];
export type FolderId = number | VirtualFolderId;
export const DEFAULT_VIRTUAL_FOLDER: VirtualFolderId = "library";
