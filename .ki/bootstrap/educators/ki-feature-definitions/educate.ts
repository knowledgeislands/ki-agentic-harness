#!/usr/bin/env bun
import { resolve } from 'node:path'
import { runSkillEducator } from './educator.ts'

runSkillEducator({ skill: "ki-feature-definitions", source: resolve(import.meta.dirname, 'skill') })
