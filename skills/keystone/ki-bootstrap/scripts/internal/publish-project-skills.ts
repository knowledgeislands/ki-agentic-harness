#!/usr/bin/env bun
/** Publish generated regular-file project skill copies for normal repository use. */
import { runProjectLinks } from './project-skill-publisher.ts'

process.exit(runProjectLinks('skills'))
