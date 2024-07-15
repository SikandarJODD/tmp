import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
	entries: ['src/index','src/util'],
	failOnWarn: false,
	declaration: true,
	clean: true,
});
