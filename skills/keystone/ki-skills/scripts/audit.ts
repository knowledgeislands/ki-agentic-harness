#!/usr/bin/env bun
// Temporary legacy launcher — delete when ki-bootstrap invokes govern.ts directly.
// Usage: bun scripts/govern.ts audit [-h|--help] [options].
import { main } from './govern.ts'

if (import.meta.main) main(['audit', ...process.argv.slice(2)])
