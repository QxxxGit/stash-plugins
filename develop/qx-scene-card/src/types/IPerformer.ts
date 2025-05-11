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
	image_path?: string;
	birthdate?: string;
	death_date?: string;
}
