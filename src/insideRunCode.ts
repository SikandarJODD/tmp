/* 
let file = path.join(dir, '/src/lib/db.ts');
								await fs.writeFileSync(file, `import { createClient } from '@supabase/supabase-js'
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

export default supabase`);
								//  create .env inside root
								file = path.join(dir, '/.env');
								await fs.writeFileSync(file, `VITE_SUPABASE_URL=https://<your_supabase_url>.supabase.co
VITE_SUPABASE_ANON_KEY=<your_supabase_anon_key>`);
								await execa({ cwd: dir })`npm install @supabase/supabase-js`;
*/

/*
let dbfile = fs.readFile('./src/db.ts', 'utf8', (err, data) => {
									if (err) {
										console.error(err)
										return
									}
									console.log(data);
									let file = path.join(dir, '/src/lib/db.ts');
									fs.writeFileSync(file, data);
								});
								await execa({ cwd: dir })`npm install @supabase/supabase-js`;
*/
/* 
#!/usr/bin/env node
// we add execa here to make command execution easy
import { execa } from 'execa';
import { create, util } from 'template-factory';
import * as p from '@clack/prompts';
import { confirm } from '@clack/prompts';
import { select } from '@clack/prompts';

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
				// we put '../' because it is relative to the index.js file
				path: util.relative('/templates/code', import.meta.url),
				flag: 'sveltekit',
				prompts: [
					{
						kind: 'confirm',
						message: 'Would you like to install Tailwind CSS',
						yes: {
							run: async ({ dir }) => {
								await execa({ cwd: dir })`npx @svelte-add/tailwindcss@latest`;
								await select({
									message: 'Pick a CSS Framework',
									initialValue: 'daisyui',
									options: [
										{ value: 'daisyui', label: 'TypeScript', },
										{ value: 'shadcn', label: 'JavaScript', hint: 'This is a hint' },
									],

								}).then((res) => {
									console.log(res);
								});
							},
							startMessage: 'Installing @threlte',
							endMessage: 'Installed @threlte',
						},
					},
				],
			},
		],
	});
};

main();
*/