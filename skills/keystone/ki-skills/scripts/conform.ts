#!/usr/bin/env bun
// Temporary legacy launcher — delete when ki-bootstrap invokes govern.ts directly.
// Usage: bun scripts/govern.ts conform [-h|--help] [options].
import { main } from './govern.ts'

if (import.meta.main) main(['conform', ...process.argv.slice(2)])
