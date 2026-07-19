#!/usr/bin/env bun
import { resolve } from 'node:path'
import { runSkillEducator } from './vendored/ki-bootstrap/educator.ts'

runSkillEducator({ skill: 'ki-plugins', source: resolve(import.meta.dirname, '..') })
