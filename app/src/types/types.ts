export type Boat = {
	color: string;
	hasProtrusion?: 'on' | 'off';
	height: string;
	name: string;
	power?: string;
	width: string;
	id: string;
};

export type InputBoatForm = Boat & {
	add?: string;
	deleteBoat?: string;
	editBoat?: string;
};

export type FormFieldTypes = 'color' | 'checkbox' | 'number' | 'text' | 'select';

export interface FormFieldProps {
	label: string;
	name: string;
	type: FormFieldTypes;
	isConfigureMode: boolean;
	options?: Array<{ name: string; id: string }>;
	// options?: string[];
	placeholder?: string;
	inputId?: string;
	value?: string | number;
}

export interface configuredFieldProps extends FormFieldProps {
	value: string;
	id: string;
}

export type HexColor = string;
