
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
								await execa({ cwd: dir })`npm install -D tailwindcss postcss autoprefixer`;
								await execa({ cwd: dir })`npx tailwindcss init -p`;
								let file = path.join(dir, '/svelte.config.js');
								fs.writeFileSync(file, `import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter()
  },
  preprocess: vitePreprocess()
};
export default config;
`)
								// replate tailwind config file with the following code
								let pathtoTailwind = path.join(dir, 'tailwind.config.js');
								console.log(pathtoTailwind,'Path');
								let dbfile = fs.readFile(pathtoTailwind, 'utf8', (err, data) => {
									if (err) {
										console.error(err)
										return
									}
									data = data.replace(/content: \[\]/, `content: ['./src/**/*.{html,js,svelte,ts}'],`);
									fs.writeFileSync(pathtoTailwind, data);
								});
								let appcss = path.join(dir, '/src/app.css');
								fs.writeFileSync(appcss, `@tailwind base;
@tailwind components;
@tailwind utilities;`);
								// create layout.svelte inside src/routes
								let layout = path.join(dir, 'src/routes/+layout.svelte');
								fs.writeFileSync(layout, `<script>
  import "../app.css";
</script>

<slot />`);
								// const { stdout } = await execa('npx', ['@svelte-add/tailwindcss@latest', '--typography', 'false'], { cwd: dir });
								// console.log(stdout, 'output');
								return [
									{
										kind: 'confirm',
										message: 'Would you like to Install Tailwind CSS Framework',
										yes: {
											run: async ({ dir }): Promise<Prompt[]> => {
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
																		await execa({ cwd: dir })`npm install daisyui`;
																		// replace the content of tailwind.config.ts file to require('daisyui') in plugin section
																		let pathtoTailwind = path.join(dir, 'tailwind.config.js');
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
								let data = `import { createClient } from '@supabase/supabase-js'
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

export default supabase`;
								let file = path.join(dir, '/src/lib/db.ts');
								fs.writeFileSync(file, data);
								 file = path.join(dir, '/.env');
								let envCode =`
VITE_SUPABASE_URL = https://<your_supabase_url>.supabase.co
VITE_SUPABASE_ANON_KEY = <your_supabase_anon_key>`;
								fs.writeFileSync(file, envCode);
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