#!/usr/bin/env bun
import { resolve } from 'node:path'
import { runSkillEducator } from './educator.ts'

runSkillEducator({ skill: "ki-decision-records", source: resolve(import.meta.dirname, 'skill') })
