#!/usr/bin/env node

import { forget } from '@xylabs/forget'

import { packageGenDocs } from '../../actions'

forget(packageGenDocs())
