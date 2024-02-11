export type Boat = {
	color: string;
	hasProtrusion?: 'on' | 'off';
	height: string;
	name: string;
	power?: string;
	width: string;
	id: string;
};

export type FormFieldTypes = 'color' | 'checkbox' | 'number' | 'text' | 'select';

export interface FormFieldProps {
	label: string;
	name: string;
	type: FormFieldTypes;
	isConfigureMode: boolean;
	options?: string[];
	placeholder?: string;
	inputId?: string;
}

export interface configuredFieldProps extends FormFieldProps {
	value: string;
	id: string;
}
