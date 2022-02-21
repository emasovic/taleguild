var shell = require('shelljs');
const branchName = require('branch-name');

if (!shell.which('git')) {
	shell.echo('Sorry, this script requires git, please install git on your system');
	shell.exit(1);
}

async function releaseVersion(args) {
	let isPatch = false;
	if (args.length > 3) {
		isPatch = args[3] === 'patch';
	}

	let npm_package_version = process.env.npm_package_version;
	let currentBranch = await Promise.resolve(branchName.get());

	shell.echo(
		'Starting release of version ' + npm_package_version + ' on Branch ' + currentBranch
	);

	//git commit -a -m \"Release of v$npm_package_version\"
	if (shell.exec(`git commit -a -m "Release of v${npm_package_version}"`).code !== 0) {
		shell.echo('Error: Git commit failed');
		shell.exit(1);
	} else {
		shell.echo('Version file changed');
	}

	if (currentBranch === 'dev' && !isPatch) {
		shell.echo('Making new branch');
		if (shell.exec(`git checkout -b "Release-v${npm_package_version}"`).code !== 0) {
			shell.echo('Error: Git branch make failed');
			shell.exit(1);
		} else {
			shell.echo('Version branch made');
			if (shell.exec(`git push -u origin "Release-v${npm_package_version}"`).code !== 0) {
				shell.echo('Error: Git branch push failed');
				shell.exit(1);
			} else {
				shell.echo('Version branch pushed');
				shell.exec('git checkout dev');
			}
		}
	}

	// git tag v$npm_package_version -a -f -m \"Release for $npm_package_version\"
	if (
		shell.exec(`git tag v${npm_package_version} -a -f -m "Release for ${npm_package_version}" `)
			.code !== 0
	) {
		shell.echo('Error: Git tag make failed');
		shell.exit(1);
	}

	// git push --follow-tags origin
	if (shell.exec('git push --follow-tags origin HEAD').code !== 0) {
		shell.echo('Error: Git push failed');
		shell.exit(1);
	}

	shell.echo('Successfully released version ' + npm_package_version);
}

releaseVersion(process.argv);
