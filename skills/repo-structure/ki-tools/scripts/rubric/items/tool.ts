import { judgment, mechanical, one } from './shared.ts'
export const TOOL_BIN = mechanical(
  'TOOL-BIN',
  'Tool executable',
  '`bin/` exists and holds at least one file.',
  'FAIL',
  (c) =>
    one(
      !c.targetExists
        ? { status: 'VIOLATION', message: 'target is not a directory', subject: c.target }
        : !c.binExists
          ? { status: 'VIOLATION', message: 'tool executable directory is missing', subject: 'bin/' }
          : !c.bins.length
            ? { status: 'VIOLATION', message: 'no executable files found — add the tool executable', subject: 'bin/' }
            : {
                status: 'PASS',
                message: `contains ${c.bins.length} executable candidate(s): ${c.bins.map((bin) => bin.name).join(', ')}`,
                subject: 'bin/'
              }
    ),
  (c) => c.conformBins()
)
export const TOOL_EXEC = mechanical(
  'TOOL-EXEC',
  'Executable bit',
  'Every `bin/<file>` carries the executable bit.',
  'FAIL',
  (c) => {
    if (!c.bins.length) return one({ status: 'NOT_APPLICABLE', message: 'No bin files to inspect.' })
    const bad = c.bins.filter((bin) => !bin.executable)
    return bad.length
      ? one({
          status: 'VIOLATION',
          message: `missing the executable bit (chmod +x): ${bad.map((bin) => bin.name).join(', ')}`,
          subject: 'bin/'
        })
      : one({ status: 'PASS', message: 'every bin/ file is executable', subject: 'bin/' })
  },
  (c) => c.conformBins()
)
export const TOOL_SCOPE = judgment('TOOL-SCOPE', 'One command', 'The repository contains genuinely one tool rather than distinct commands.')
export const TOOL_XDG = judgment(
  'TOOL-XDG',
  'XDG storage',
  'The tool follows the XDG Base Directory specification for config, state, and cache.'
)
export const TOOL_INSTALL = mechanical(
  'TOOL-INSTALL',
  'Installer executable',
  '`install.sh` is present and executable.',
  'WARN',
  (c) =>
    one(
      c.install === 'missing'
        ? { status: 'VIOLATION', message: 'no install.sh at the repository root', subject: 'install.sh' }
        : c.install === 'non-executable'
          ? { status: 'VIOLATION', message: 'install.sh is present but lacks the executable bit', subject: 'install.sh' }
          : { status: 'PASS', message: 'install.sh is present and executable', subject: 'install.sh' }
    ),
  (c) => c.conformInstall()
)
export const TOOL_INSTALL_QUALITY = judgment(
  'TOOL-INSTALL-QUALITY',
  'Installer quality',
  'The installer is POSIX-ish, honours overrides, verifies downloads, and is idempotent.'
)
export const TOOL_VERSION = mechanical(
  'TOOL-VERSION',
  'Version flag',
  'The primary executable contains `--version` handling.',
  'WARN',
  (c) =>
    !c.primary
      ? one({ status: 'NOT_APPLICABLE', message: 'No primary executable.' })
      : one(
          c.primaryText.includes('--version')
            ? { status: 'PASS', message: 'primary executable handles --version', subject: `bin/${c.primary}` }
            : { status: 'VIOLATION', message: 'primary executable has no visible --version handling', subject: `bin/${c.primary}` }
        )
)
export const TOOL_VERSION_SOURCE = judgment(
  'TOOL-VERSION-SOURCE',
  'Version source',
  'The version marker has one source of truth aligned with the latest tag and changelog.'
)
export const TOOL_CHANGELOG = mechanical('TOOL-CHANGELOG', 'Changelog presence', '`CHANGELOG.md` is present.', 'WARN', (c) =>
  one(
    c.changelog
      ? { status: 'PASS', message: 'release history file is present', subject: 'CHANGELOG.md' }
      : { status: 'VIOLATION', message: 'release history file is absent', subject: 'CHANGELOG.md' }
  )
)
export const TOOL_CHANGELOG_FORMAT = judgment(
  'TOOL-CHANGELOG-FORMAT',
  'Changelog format',
  'The changelog follows Keep a Changelog and semantic versioning.'
)
export const TOOL_CI = mechanical('TOOL-CI', 'CI workflow', 'At least one workflow YAML file is present.', 'WARN', (c) =>
  one(
    c.workflows.length
      ? { status: 'PASS', message: `${c.workflows.length} CI workflow file(s) present`, subject: '.github/workflows/' }
      : { status: 'VIOLATION', message: 'no .github/workflows/*.yml workflow', subject: '.github/workflows/' }
  )
)
export const TOOL_TAP = judgment('TOOL-TAP', 'Companion formula', 'A companion Homebrew formula exists in the governed tap.')
export const TOOL_TESTS = mechanical('TOOL-TESTS', 'Test directory', 'A `tests/` directory is present.', 'WARN', (c) =>
  one(
    c.tests
      ? { status: 'PASS', message: 'tests/ directory present', subject: 'tests/' }
      : { status: 'VIOLATION', message: 'tests/ directory absent', subject: 'tests/' }
  )
)
export const TOOL_ENGINEERING = judgment(
  'TOOL-ENGINEERING',
  'Engineering declaration',
  'A package.json-bearing repository declares ki-engineering.'
)
export const TOOL_LANGUAGE = judgment(
  'TOOL-LANGUAGE',
  'Other-language toolchain',
  'A non-shell, non-JavaScript tool wires its own lint and test toolchain into CI.'
)
export const TOOL_RELEASE_CHECK = judgment(
  'TOOL-RELEASE-CHECK',
  'Release alignment',
  'Version markers, tags, releases, and changelog entries agree.'
)
export const TOOL = [
  TOOL_BIN,
  TOOL_EXEC,
  TOOL_SCOPE,
  TOOL_XDG,
  TOOL_INSTALL,
  TOOL_INSTALL_QUALITY,
  TOOL_VERSION,
  TOOL_VERSION_SOURCE,
  TOOL_CHANGELOG,
  TOOL_CHANGELOG_FORMAT,
  TOOL_CI,
  TOOL_TAP,
  TOOL_TESTS,
  TOOL_ENGINEERING,
  TOOL_LANGUAGE,
  TOOL_RELEASE_CHECK
] as const
