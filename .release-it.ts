import type { Config } from 'release-it';

export default {
    git: {
        commitMessage: 'chore: release v${version}',
        requireCleanWorkingDir: true,
        tagName: '${branchName}-${version}',
    },
    github: {
        release: false,
    },
    npm: {
        publish: false,
    },
    plugins: {
        '@release-it/conventional-changelog': {
            preset: 'conventionalcommits',
            infile: 'CHANGELOG.md',
        },
    },
} satisfies Config;
