#!/usr/bin/env node

import { packageGenDocs } from '../../actions'

import { forget } from '@xylabs/forget'

forget(packageGenDocs())
