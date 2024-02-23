import type { FormFieldProps } from './types/types';

export const formFields: FormFieldProps[] = [
	{
		label: 'Name',
		name: 'name',
		type: 'text',
		isConfigureMode: false,
		placeholder: 'Name des Bootes',
		value: 'Seefalke'
	},
	{
		label: 'Länge (m)',
		name: 'width',
		type: 'number',
		isConfigureMode: false,
		placeholder: 'Länge des Bootes in Metern',
		value: 3
	},
	{
		label: 'Breite (m)',
		name: 'height',
		type: 'number',
		isConfigureMode: false,
		placeholder: 'Breite des Bootes in Metern',
		value: 1
	},
	{ label: 'Farbe', name: 'color', type: 'color', isConfigureMode: false, placeholder: '#1264AF' },
	{
		label: 'Mit Spitze?',
		name: 'hasProtrusion',
		type: 'checkbox',
		isConfigureMode: false
	},
	{
		label: 'Power',
		name: 'power',
		type: 'select',
		isConfigureMode: true,
		options: [
			{ name: 'Kein Strom', id: 'Kein Strom' },
			{ name: '16A', id: '16A' },
			{ name: '32A', id: '32A' },
			{ name: '64A', id: '64A' }
		]
	}
];
