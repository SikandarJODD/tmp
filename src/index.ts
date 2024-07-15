
import { execa } from 'execa';
import { create, Prompt, util } from 'template-factory';

import fs from 'fs';
import path from 'path';

const main = async () => {
	await create({
		appName: 'guide',
		version: '1.0.0',
		templates: [
			{
				name: 'SvelteKit',
				// we have to pass it this way so that it resolves correctly in production
				path: util.relative('../templates/code', import.meta.url),
				flag: 'sveltekit',
				prompts: [
					{
						kind: 'confirm',
						message: 'Would you like to install Tailwind CSS',
						yes: {
							run: async ({ dir }): Promise<Prompt[]> => {
								// await execa({ cwd: dir })`npx @svelte-add/tailwindcss@latest`;
								const { stdout } = await execa('npx', ['@svelte-add/tailwindcss@latest', '--typography', 'false'], { cwd: dir });
								console.log(stdout, 'output');
								return [
									{
										kind: 'confirm',
										message: 'Would you like to Install Tailwind CSS Framework',
										yes: {
											run: async (): Promise<Prompt[]> => {
												return [
													{
														kind: 'select',
														message: 'Choose a Tailwind CSS Framework',
														initialValue: 'shadcn-svelte',
														required: true,
														options: [
															{
																name: 'daisyui', select: {
																	run: async ({ dir }) => {
																		await execa({ cwd: dir })`npm i -D daisyui@latest`;
																		// replace the content of tailwind.config.ts file to require('daisyui') in plugin section
																		let pathtoTailwind = path.join(dir, 'tailwind.config.ts');
																		let data = fs.readFileSync(pathtoTailwind, 'utf8');
																		data = data.replace(/plugins: \[\]/, `plugins: [require('daisyui')]`);
																		fs.writeFileSync(pathtoTailwind, data);
																	},
																	startMessage: 'Installing DaisyUI',
																	endMessage: 'Installed DaisyUI',
																}

															},
															{
																name: 'shadcn-svelte', select: {
																	run: async ({ dir }) => {
																		const { stdout } = await execa('npx', ['shadcn-svelte', 'init', '--yes'], { cwd: dir });
																		console.log(stdout, 'output');
																	},
																	startMessage: 'Installing shadcn-svelte',
																	endMessage: 'Installed shadcn-svelte',
																}
															},
														]
													}
												]
											}
										},

									}
								]

							},
							startMessage: 'Installing Tailwind CSS',
							endMessage: 'Installed Tailwind CSS',
						},

					},
					{
						kind: 'confirm',
						message: 'Would you like to install Supabase',
						yes: {
							run: async ({ dir }) => {
								await execa({ cwd: dir })`npm install @supabase/supabase-js`;
								let dbfile = fs.readFile(util.relative('./db.ts', import.meta.url), 'utf8', (err, data) => {
									if (err) {
										console.error(err)
										return
									}
									let file = path.join(dir, '/src/lib/db.ts');
									fs.writeFileSync(file, data);
								});
								let file = path.join(dir, '/.env');
								let envCode = await fs.readFileSync(util.relative('./envcode.txt', import.meta.url));
								fs.writeFileSync(file,envCode);
							},
							startMessage: 'Installing Supabase',
							endMessage: 'Installed Supabase',
						},
					}

				],
			},
		],
	});
};

main();