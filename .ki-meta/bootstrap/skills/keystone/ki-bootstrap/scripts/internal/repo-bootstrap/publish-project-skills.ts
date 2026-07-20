#!/usr/bin/env bun
/** Publish runtime skills as copies, except a harness's own source skills are linked. */
import { runProjectLinks } from './project-skill-publisher.ts'

process.exit(runProjectLinks('skills'))
