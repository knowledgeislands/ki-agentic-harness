import type { AuditOutcome, RubricFamily, RubricItem } from '../../shared/rubric.ts'
import type { PackagesContext } from '../contexts/packages.ts'

const STANDARD = 'standards-package-repositories.md'

const NO_PACKAGE: AuditOutcome = {
  status: 'NOT_APPLICABLE',
  message: 'No vendored package is declared and present; CONFIG-1 reports why.'
}

const PKG_1: RubricItem<PackagesContext> = {
  code: 'PKG-1',
  title: 'the vendored package carries its release version',
  description: "The vendored package's own `package.json` carries a semantic version, the version consumers lock.",
  sources: [`${STANDARD}#versions-and-releases`],
  mechanical: {
    level: 'FAIL',
    remediation: {
      class: 'diagnostic',
      guidance: 'Give `packages/<package>/package.json` the current release version; the root stays unreleased.'
    },
    audit: {
      phase: 'INSPECT',
      run: ({ packageState, packageName, version }) => {
        if (packageState !== 'physical') return [NO_PACKAGE]
        const subject = `packages/${packageName}/package.json`
        return [
          version
            ? { status: 'PASS', message: `The vendored package is at ${version}.`, subject }
            : { status: 'VIOLATION', message: 'The vendored package.json carries no semantic version.', subject }
        ]
      }
    }
  }
}

const PKG_2: RubricItem<PackagesContext> = {
  code: 'PKG-2',
  title: 'the changelog records the current release',
  description: '`CHANGELOG.md` has a section headed with the vendored package’s current version.',
  sources: [`${STANDARD}#versions-and-releases`],
  mechanical: {
    level: 'WARN',
    remediation: {
      class: 'diagnostic',
      guidance: 'Add the release’s `CHANGELOG.md` section, marking breaking changes.'
    },
    audit: {
      phase: 'INSPECT',
      run: ({ version, changelogHasVersion }) => {
        if (!version) return [NO_PACKAGE]
        return [
          changelogHasVersion
            ? { status: 'PASS', message: `CHANGELOG.md has a section for ${version}.`, subject: 'CHANGELOG.md' }
            : { status: 'VIOLATION', message: `CHANGELOG.md has no section for ${version}.`, subject: 'CHANGELOG.md' }
        ]
      }
    }
  }
}

const PKG_3: RubricItem<PackagesContext> = {
  code: 'PKG-3',
  title: 'a workbench shows the units',
  description: '`apps/workbench/` exists to show every unit alone before a release.',
  sources: [`${STANDARD}#layout`],
  mechanical: {
    level: 'WARN',
    remediation: { class: 'diagnostic', guidance: 'Add the workbench app with one story per unit.' },
    audit: {
      phase: 'INSPECT',
      run: ({ workbench }) => [
        workbench
          ? { status: 'PASS', message: 'The workbench is present.', subject: 'apps/workbench' }
          : { status: 'VIOLATION', message: 'There is no apps/workbench/.', subject: 'apps/workbench' }
      ]
    }
  }
}

const PKG_4: RubricItem<PackagesContext> = {
  code: 'PKG-4',
  title: 'AGENTS.md publishes the sync paragraph',
  description:
    'A block quotation in `AGENTS.md` names the vendored path and the `verify`, `drift`, `sync` and `defer` tools, for every consumer to carry word for word.',
  sources: [`${STANDARD}#the-sync-paragraph`],
  mechanical: {
    level: 'WARN',
    remediation: {
      class: 'diagnostic',
      guidance: 'Publish the sync paragraph as a block quotation under its own heading in AGENTS.md.'
    },
    audit: {
      phase: 'INSPECT',
      run: ({ packageState, syncParagraph }) => {
        if (packageState !== 'physical') return [NO_PACKAGE]
        return [
          syncParagraph
            ? { status: 'PASS', message: 'AGENTS.md publishes the sync paragraph.', subject: 'AGENTS.md' }
            : {
                status: 'VIOLATION',
                message: 'AGENTS.md quotes no paragraph naming the vendored path and all four vendoring tools.',
                subject: 'AGENTS.md'
              }
        ]
      }
    }
  }
}

const PKG_5: RubricItem<PackagesContext> = {
  code: 'PKG-5',
  title: 'the vendored tsconfig stands alone',
  description:
    'The vendored package’s `tsconfig.json` extends no other configuration, which would resolve against each consumer’s root.',
  sources: [`${STANDARD}#code-form-and-the-engineering-standard`],
  mechanical: {
    level: 'WARN',
    remediation: {
      class: 'diagnostic',
      guidance: 'Inline the compiler options the vendored tsconfig.json inherits and drop its `extends`.'
    },
    audit: {
      phase: 'INSPECT',
      run: ({ packageState, packageName, tsconfigExtends }) => {
        if (packageState !== 'physical') return [NO_PACKAGE]
        const subject = `packages/${packageName}/tsconfig.json`
        if (tsconfigExtends === null)
          return [{ status: 'NOT_APPLICABLE', message: 'The vendored package has no tsconfig.json.', subject }]
        return [
          tsconfigExtends
            ? { status: 'VIOLATION', message: 'The vendored tsconfig.json extends another configuration.', subject }
            : { status: 'PASS', message: 'The vendored tsconfig.json stands alone.', subject }
        ]
      }
    }
  }
}

const PKG_6: RubricItem<PackagesContext> = {
  code: 'PKG-6',
  title: 'no consumer register',
  description: 'The repository keeps no list of its consumers; they are found by the lock file they hold.',
  sources: [`${STANDARD}#consumers`],
  mechanical: {
    level: 'WARN',
    remediation: {
      class: 'diagnostic',
      guidance: 'Find consumers by scanning the local estate for the package’s lock file, then retire the register.'
    },
    audit: {
      phase: 'INSPECT',
      run: ({ registers }) =>
        registers.length
          ? registers.map((subject) => ({
              status: 'VIOLATION' as const,
              message: 'A consumer register names the repositories that use the package.',
              subject
            }))
          : [{ status: 'PASS', message: 'The repository keeps no consumer register.' }]
    }
  }
}

const PKG_J1: RubricItem<PackagesContext> = {
  code: 'PKG-J1',
  title: 'units stay generic',
  description:
    'Consumer or organisation detail reaches a unit only through configuration, a slot, a namespaced custom property or the consumer’s adapter, and no consumer name appears in the vendored tree.',
  sources: [`${STANDARD}#generic-units`],
  judgment: {
    scope: 'Every unit, style and vendoring tool in the vendored tree.',
    prompt:
      'Does any unit hold a constant, name or branch that serves one consumer or organisation rather than a configurable, generic behaviour?',
    outcomes: ['conforming', 'generalisation required', 'owner decision required'],
    guidance:
      'Move the consumer-specific detail behind configuration, a slot, a custom property or the consumer’s adapter, and remove any consumer name from the vendored tree.'
  }
}

const PKG_J2: RubricItem<PackagesContext> = {
  code: 'PKG-J2',
  title: 'releases follow the release and re-vendor rule',
  description:
    'Each release bumps the agreeing version locations, adds its changelog section, is tagged `v<version>` and asks each consumer to re-vendor; a deferral older than two releases is raised with the owner.',
  sources: [`${STANDARD}#versions-and-releases`],
  judgment: {
    scope:
      'The latest releases: version locations, changelog sections, tags, the notices sent and consumers’ deferrals.',
    prompt:
      'Do the version locations agree with the tag and changelog, was each consumer asked to re-vendor, and is any deferral older than two releases still unraised?',
    outcomes: ['conforming', 'release correction required', 'owner query required'],
    guidance:
      'Bring the version locations, changelog and tag into agreement; send the missing re-vendor notices; raise stale deferrals with the owner.'
  }
}

const PKG_J3: RubricItem<PackagesContext> = {
  code: 'PKG-J3',
  title: 'unit changes carry tests and a workbench story',
  description: 'Every unit change has its tests in the vendored tree, and every unit has one workbench story.',
  sources: [`${STANDARD}#changing-the-package`],
  judgment: {
    scope: 'Recent unit changes and the workbench stories against the unit manifest.',
    prompt: 'Does each changed unit carry tests, and does every unit in the manifest have exactly one workbench story?',
    outcomes: ['conforming', 'test coverage required', 'workbench story required'],
    guidance: 'Add the missing tests beside the unit and the missing story to the workbench.'
  }
}

const PKG_J4: RubricItem<PackagesContext> = {
  code: 'PKG-J4',
  title: 'plain JavaScript meets the engineering intent',
  description:
    'Where the package is plain JavaScript, it is typed with JSDoc and checked by `tsc --checkJs`, uses `.js` modules, keeps fixed-name tool configurations in TypeScript and uses the house script names.',
  sources: [`${STANDARD}#code-form-and-the-engineering-standard`],
  judgment: {
    scope: 'Workspace tsconfig files, module extensions, tool configurations, the boundary proof and package scripts.',
    prompt:
      'Does each workspace type-check its JavaScript with `checkJs` under the house invariants, and do the scripts and boundary proof meet the engineering standard’s intent?',
    outcomes: ['conforming', 'toolchain revision required', 'engineering exception to record'],
    guidance:
      'Enable `allowJs` and `checkJs`, rename `.mjs` to `.js`, keep fixed-name configurations in TypeScript and use the house script names; record any exception where it is raised.'
  }
}

export const PKG: RubricFamily<PackagesContext, PackagesContext> = {
  code: 'PKG',
  title: 'Package repository shape',
  description: 'The vendored package, workbench, sync paragraph, consumers, releases and code form.',
  standard: STANDARD,
  selectContext: (context) => context,
  items: [PKG_1, PKG_2, PKG_3, PKG_4, PKG_5, PKG_6, PKG_J1, PKG_J2, PKG_J3, PKG_J4]
}
