#!/usr/bin/env bun
import { resolve } from 'node:path'
import { runSkillEducator } from './educator.ts'

runSkillEducator({ skill: "ki-agents", source: resolve(import.meta.dirname, 'skill') })
