#!/usr/bin/env bun
/** Compatibility entry point for the project-local skills linker. */
import { runProjectLinks } from './project-links.ts'

process.exit(runProjectLinks('skills'))
