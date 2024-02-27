import { z } from 'zod';

export const baseFormSchema = z.object({
	name: z.string(),
	width: z.number(),
	height: z.number(),
	color: z.string(),
	hasProtrusion: z.boolean(),
	power: z.enum(['Kein Strom', '16A', '32A', '64A']).optional()
});

// function generateZodSchema(fields: FormFieldProps[]): ZodSchema<unknown> {
// 	const schema: Record<string, unknown> = {};

// 	fields.forEach((field) => {
// 		switch (field.type) {
// 			case 'text':
// 			case 'color':
// 				schema[field.name] = z.string();
// 				break;
// 			case 'number':
// 				schema[field.name] = z.number();
// 				break;
// 			case 'checkbox':
// 				schema[field.name] = z.boolean();
// 				break;
// 			case 'select':
// 				if (field.options) {
// 					const enumValues = field.options.map((option) => option.id);
// 					schema[field.name] = z.enum(enumValues);
// 				}
// 				break;
// 		}
// 	});

// 	return z.object(schema);
// }
