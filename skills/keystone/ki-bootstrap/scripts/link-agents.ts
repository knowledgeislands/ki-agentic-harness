#!/usr/bin/env bun
/** Compatibility entry point for the project-local Claude agents linker. */
import { runProjectLinks } from './lib/project-skill-publisher.ts'

process.exit(runProjectLinks('agents'))
