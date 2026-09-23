#!/usr/bin/env bash
# Build, sync Capacitor, and launch the iOS Simulator.
# Safe to run from any directory.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
echo "→ $ROOT"
npm run cap:run:ios
