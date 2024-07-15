import { execa } from "execa";
import { create, Template, util } from "template-factory";

import fs from "fs";
import path from "path";

const main = async () => {
	const templates: Template[] = [
		{
			name: "SvelteKit",
			// we have to pass it this way so that it resolves correctly in production
			path: util.relative("../templates/sveltekit", import.meta.url),
			flag: "sveltekit",
			excludeFiles: ["template-files"],
			prompts: [
				{
					kind: "confirm",
					message: "Would you like to install Tailwind CSS",
					yes: {
						run: async ({ dir, error }) => {
							// await execa({ cwd: dir })`npx @svelte-add/tailwindcss@latest`;
							await execa("npx", ["@svelte-add/tailwindcss@latest", "--typography", "false"], {
								cwd: dir,
							}).catch(err => error(err));
							return [
								{
									kind: "confirm",
									message: "Would you like to Install Tailwind CSS Framework",
									yes: {
										run: async () => {
											return [
												{
													kind: "select",
													message: "Choose a Tailwind CSS Framework",
													initialValue: "shadcn-svelte",
													required: true,
													options: [
														{
															name: "daisyui",
															select: {
																run: async ({ dir }) => {
																	await execa({ cwd: dir })`npm i -D daisyui@latest`;
																	// replace the content of tailwind.config.ts file to require('daisyui') in plugin section
																	let pathtoTailwind = path.join(
																		dir,
																		"tailwind.config.ts"
																	);
																	let data = fs.readFileSync(pathtoTailwind, "utf8");
																	data = data.replace(
																		/plugins: \[\]/,
																		`plugins: [require('daisyui')]`
																	);
																	fs.writeFileSync(pathtoTailwind, data);
																},
																startMessage: "Installing DaisyUI",
																endMessage: "Installed DaisyUI",
															},
														},
														{
															name: "shadcn-svelte",
															select: {
																run: async ({ dir }) => {
																	await execa(
																		"npx",
																		["shadcn-svelte", "init", "--yes"],
																		{ cwd: dir }
																	);
																},
																startMessage: "Installing shadcn-svelte",
																endMessage: "Installed shadcn-svelte",
															},
														},
													],
												},
											];
										},
									},
								},
							];
						},
						startMessage: "Installing Tailwind CSS",
						endMessage: "Installed Tailwind CSS",
					},
				},
				{
					kind: "confirm",
					message: "Would you like to install Supabase",
					yes: {
						run: async ({ dir }) => {
							await execa({ cwd: dir })`npm install @supabase/supabase-js`;

							const dbPath = util.relative(
								"../templates/sveltekit/template-files/supabase/db.ts",
								import.meta.url
							);

							fs.copyFileSync(dbPath, path.join(dir, "src/lib/db.ts"));

							const envPath = util.relative(
								"../templates/sveltekit/template-files/supabase/.env",
								import.meta.url
							);

							fs.copyFileSync(envPath, path.join(dir, ".env"));
						},
						startMessage: "Installing Supabase",
						endMessage: "Installed Supabase",
					},
				},
			],
		},
	];

	// get version from package.json
	const { version, name } = JSON.parse(fs.readFileSync(new URL("../package.json", import.meta.url), "utf-8"));

	await create({
		appName: name,
		version: version,
		templates: templates,
	});
};

main();
