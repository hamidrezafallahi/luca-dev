#!/bin/bash
# Mirror docs for CI operators.
# Real production script lives in luca-prod and on the VPS at /opt/luca-prod/deploy.sh
#
# Usage:
#   ./deploy.sh {frontend|backend|all} <git-sha>
#   ./deploy.sh nginx
#   ./deploy.sh rollback {frontend|backend|all}
#
# GitHub Actions passes github.sha so compose pulls:
#   hamidrezafalahi/luca-frontend:<sha>
#   hamidrezafalahi/luca-backend:<sha>
echo "Production deploy scripts live in the luca-prod repo on the VPS (/opt/luca-prod)."
echo "Use: ./deploy.sh {frontend|backend|all} <git-sha>"
echo "     ./deploy.sh nginx"
echo "     ./deploy.sh rollback {frontend|backend|all}"
exit 1
