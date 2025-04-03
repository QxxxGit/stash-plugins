export interface ISliderRange {
	min: number;
	default: number;
	max: number;
	divider: number;
};

export interface IFilter {
    slider: ISliderRange;
    value: number;
}

export interface ISceneFilters {
    brightness: IFilter,
    contrast: IFilter,
    gamma: IFilter,
    rotate: IFilter,
    scale: IFilter,
    aspectRatio: IFilter,
    xPosition: IFilter,
    yPosition: IFilter
}

export const DefaultFilters: ISceneFilters = {
    brightness: {
        slider: {
            min: 0,
            default: 100,
            max: 200,
            divider: 1
        },
        value: 100
    },
    contrast: {
        slider: {
            min: 0,
            default: 100,
            max: 200,
            divider: 1
        },
        value: 100
    },
    gamma: {
        slider: {
            min: 0,
            default: 100,
            max: 200,
            divider: 200
        },
        value: 100
    },
    rotate: {
        slider: {
            min: 0,
            default: 2,
            max: 4,
            divider: 1 / 90
        },
        value: 2
    },
    scale: {
        slider: {
            min: 0,
            default: 100,
            max: 200,
            divider: 1
        },
        value: 100
    },
    aspectRatio: {
        slider: {
            min: 0,
            default: 150,
            max: 300,
            divider: 100
        },
        value: 150
    },
    xPosition: {
        slider: {
            min: -100,
            default: 0,
            max: 100,
            divider: 1
        },
        value: 0
    },
    yPosition: {
        slider: {
            min: -100,
            default: 0,
            max: 100,
            divider: 1
        },
        value: 0
    }
}