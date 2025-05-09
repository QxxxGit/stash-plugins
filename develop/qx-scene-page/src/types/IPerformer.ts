export enum GenderEnum {
	MALE,
	FEMALE,
	TRANSGENDER_MALE,
	TRANSGENDER_FEMALE,
	INTERSEX,
	NON_BINARY,
}

export interface IPerformer {
	id: number;
	name: string;
	gender?: GenderEnum;
	birthdate?: string;
	image_path?: string;
	scene_count: number;
}
