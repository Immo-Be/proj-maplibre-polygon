// import { superValidate } from 'sveltekit-superforms';
// import { zod } from 'sveltekit-superforms/adapters';
// import { z } from 'zod';

// const baseFormSchema = z.object({
// 	name: z.string().default('Seefalke'),
// 	width: z.number().default(3),
// 	height: z.number().default(1),
// 	color: z.string().default('#1264AF'),
// 	hasProtrusion: z.boolean().default(true),
// 	power: z.enum(['Kein Strom', '16A', '32A', '64A']).optional()
// });

// export const load = async () => {
// 	const form = await superValidate(zod(baseFormSchema));

// 	return { form };
// };
