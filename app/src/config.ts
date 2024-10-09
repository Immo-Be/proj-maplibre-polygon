import type { FormFieldProps } from './types/types';

export const formFields: FormFieldProps[] = [
	{
		label: 'Name',
		name: 'name',
		type: 'text',
		isConfigureMode: false,
		placeholder: 'Name des Bootes'
	},
	{
		label: 'Länge (m)',
		name: 'width',
		type: 'number',
		isConfigureMode: false,
		placeholder: 'Länge des Bootes in Metern'
	},
	{
		label: 'Breite (m)',
		name: 'height',
		type: 'number',
		isConfigureMode: false,
		placeholder: 'Breite des Bootes in Metern'
	},
	{ label: 'Farbe', name: 'color', type: 'color', isConfigureMode: false, placeholder: '#1264AF' },
	{
		label: 'Mit Spitze?',
		value: 'on',
		name: 'hasProtrusion',
		type: 'checkbox',
		isConfigureMode: false
	},
	{
		label: 'Power',
		name: 'power',
		type: 'select',
		isConfigureMode: false,
		options: [
			{ name: 'Kein Strom', id: 'Kein Strom' },
			{ name: '16A', id: '16A' },
			{ name: '32A', id: '32A' },
			{ name: '64A', id: '64A' }
		]
	},
	{
		label: 'Noitz',
		name: 'notiz',
		type: 'text',
		value: '',
		required: false,
		isConfigureMode: false,
		placeholder: 'Füge eine neue Notiz hinzu'
	}
];
