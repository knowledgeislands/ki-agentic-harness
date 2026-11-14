import type { AuditOutcome, RubricFamily, RubricItem } from '../../shared/rubric.ts'
import type { PackagesContext } from '../contexts/packages.ts'

const STANDARD = 'standards-package-repositories.md'

const NO_PACKAGE: AuditOutcome = {
  status: 'NOT_APPLICABLE',
  message: 'No vendored package is declared and present; CONFIG-1 reports why.'
}

const PKG_1: RubricItem<PackagesContext> = {
  code: 'PKG-1',
  title: 'each vendored package carries the release version',
  description:
    "Each vendored package's own `package.json` carries a semantic version, the version consumers lock, and where there are several they release together at one version.",
  sources: [`${STANDARD}#versions-and-releases`],
  mechanical: {
    level: 'FAIL',
    remediation: {
      class: 'diagnostic',
      guidance:
        'Give each `packages/<package>/package.json` the current release version, the same in every package; the root stays unreleased.'
    },
    audit: {
      phase: 'INSPECT',
      run: ({ packages, releaseVersion }) => {
        const present = packages.filter((entry) => entry.physical)
        if (!present.length) return [NO_PACKAGE]
        const outcomes: AuditOutcome[] = present.map(({ name, version }) => {
          const subject = `packages/${name}/package.json`
          return version
            ? { status: 'PASS', message: `packages/${name}/ is at ${version}.`, subject }
            : { status: 'VIOLATION', message: 'The vendored package.json carries no semantic version.', subject }
        })
        if (present.every((entry) => entry.version) && releaseVersion === null)
          outcomes.push({
            status: 'VIOLATION',
            message: `The vendored packages release together, but their versions differ: ${present
              .map(({ name, version }) => `${name} ${version}`)
              .join(', ')}.`,
            subject: 'packages/'
          })
        return outcomes
      }
    }
  }
}

const PKG_2: RubricItem<PackagesContext> = {
  code: 'PKG-2',
  title: 'the changelog records the current release',
  description: '`CHANGELOG.md` has a section headed with the vendored packages’ current version.',
  sources: [`${STANDARD}#versions-and-releases`],
  mechanical: {
    level: 'WARN',
    remediation: {
      class: 'diagnostic',
      guidance: 'Add the release’s `CHANGELOG.md` section, marking breaking changes.'
    },
    audit: {
      phase: 'INSPECT',
      run: ({ releaseVersion, changelogHasVersion }) => {
        if (!releaseVersion) return [NO_PACKAGE]
        return [
          changelogHasVersion
            ? { status: 'PASS', message: `CHANGELOG.md has a section for ${releaseVersion}.`, subject: 'CHANGELOG.md' }
            : {
                status: 'VIOLATION',
                message: `CHANGELOG.md has no section for ${releaseVersion}.`,
                subject: 'CHANGELOG.md'
              }
        ]
      }
    }
  }
}

const PKG_3: RubricItem<PackagesContext> = {
  code: 'PKG-3',
  title: 'a Storybook shows the units and builds to static files',
  description:
    '`apps/storybook/` exists to show every unit alone before a release, its `build` script writes it as static files, and the retired `apps/workbench/` is gone.',
  sources: [`${STANDARD}#layout`],
  mechanical: {
    level: 'WARN',
    remediation: {
      class: 'diagnostic',
      guidance:
        'Add the Storybook app at `apps/storybook/` with one story per unit and a `build` script that writes static files, then retire `apps/workbench/`.'
    },
    audit: {
      phase: 'INSPECT',
      run: ({ storybook, storybookBuild, workbench }) => {
        const outcomes: AuditOutcome[] = [
          !storybook
            ? { status: 'VIOLATION', message: 'There is no apps/storybook/.', subject: 'apps/storybook' }
            : storybookBuild
              ? { status: 'PASS', message: 'The Storybook is present and builds.', subject: 'apps/storybook' }
              : {
                  status: 'VIOLATION',
                  message: 'apps/storybook/package.json has no build script to write the static Storybook.',
                  subject: 'apps/storybook/package.json'
                }
        ]
        if (workbench)
          outcomes.push({
            status: 'VIOLATION',
            message: 'apps/workbench/ is the retired workbench; the Storybook replaces it.',
            subject: 'apps/workbench'
          })
        return outcomes
      }
    }
  }
}

const PKG_4: RubricItem<PackagesContext> = {
  code: 'PKG-4',
  title: 'AGENTS.md publishes each sync paragraph',
  description:
    'For each vendored package, a block quotation in `AGENTS.md` names its path and the `verify`, `drift`, `sync` and `defer` tools, for every consumer of it to carry word for word.',
  sources: [`${STANDARD}#the-sync-paragraph`],
  mechanical: {
    level: 'WARN',
    remediation: {
      class: 'diagnostic',
      guidance: 'Publish each package’s sync paragraph as a block quotation under its own heading in AGENTS.md.'
    },
    audit: {
      phase: 'INSPECT',
      run: ({ packages }) => {
        const present = packages.filter((entry) => entry.physical)
        if (!present.length) return [NO_PACKAGE]
        return present.map(({ name, syncParagraph }) =>
          syncParagraph
            ? {
                status: 'PASS' as const,
                message: `AGENTS.md publishes the sync paragraph for packages/${name}/.`,
                subject: 'AGENTS.md'
              }
            : {
                status: 'VIOLATION' as const,
                message: `AGENTS.md quotes no paragraph naming packages/${name}/ and all four vendoring tools.`,
                subject: 'AGENTS.md'
              }
        )
      }
    }
  }
}

const PKG_5: RubricItem<PackagesContext> = {
  code: 'PKG-5',
  title: 'each vendored tsconfig stands alone',
  description:
    'No vendored package’s `tsconfig.json` extends another configuration, which would resolve against each consumer’s root.',
  sources: [`${STANDARD}#code-form-and-the-engineering-standard`],
  mechanical: {
    level: 'WARN',
    remediation: {
      class: 'diagnostic',
      guidance: 'Inline the compiler options the vendored tsconfig.json inherits and drop its `extends`.'
    },
    audit: {
      phase: 'INSPECT',
      run: ({ packages }) => {
        const present = packages.filter((entry) => entry.physical)
        if (!present.length) return [NO_PACKAGE]
        return present.map(({ name, tsconfigExtends }): AuditOutcome => {
          const subject = `packages/${name}/tsconfig.json`
          if (tsconfigExtends === null)
            return { status: 'NOT_APPLICABLE', message: 'The vendored package has no tsconfig.json.', subject }
          return tsconfigExtends
            ? { status: 'VIOLATION', message: 'The vendored tsconfig.json extends another configuration.', subject }
            : { status: 'PASS', message: 'The vendored tsconfig.json stands alone.', subject }
        })
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
  title: 'unit changes carry tests and a Storybook story',
  description: 'Every unit change has its tests in the vendored tree, and every unit has one Storybook story.',
  sources: [`${STANDARD}#changing-the-package`],
  judgment: {
    scope: 'Recent unit changes and the Storybook stories against the unit manifest.',
    prompt: 'Does each changed unit carry tests, and does every unit in the manifest have exactly one Storybook story?',
    outcomes: ['conforming', 'test coverage required', 'story required'],
    guidance: 'Add the missing tests beside the unit and the missing story to the Storybook.'
  }
}

const PKG_J5: RubricItem<PackagesContext> = {
  code: 'PKG-J5',
  title: 'each web component package publishes its manifest',
  description:
    'A vendored package of custom elements ships `custom-elements.json`, generated by the Custom Elements Manifest analyser and named by its `package.json`, and the Storybook builds its controls and docs from it.',
  sources: [`${STANDARD}#the-custom-elements-manifest`],
  judgment: {
    scope: 'Each vendored package that defines custom elements, its build of the manifest, and the Storybook.',
    prompt:
      'Does each web component package ship a current `custom-elements.json` from the analyser, named by `customElements` in its `package.json`, and does the Storybook read it rather than describing the elements by hand?',
    outcomes: ['conforming', 'manifest required', 'not a web component package'],
    guidance:
      'Generate the manifest with the analyser as part of the package’s checks, name it in `package.json` under `customElements`, and point the Storybook at it.'
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
  description: 'The vendored packages, Storybook, sync paragraphs, consumers, releases, manifests and code form.',
  standard: STANDARD,
  selectContext: (context) => context,
  items: [PKG_1, PKG_2, PKG_3, PKG_4, PKG_5, PKG_6, PKG_J1, PKG_J2, PKG_J3, PKG_J4, PKG_J5]
}
