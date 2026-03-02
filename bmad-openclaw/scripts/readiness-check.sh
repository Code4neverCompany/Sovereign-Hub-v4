#!/bin/bash
# BMAD Readiness Check Script
# Verifies that sub-agent tasks align with Base, Model, Action, Data

TASK_DESCRIPTION=$1

if [ -z "$TASK_DESCRIPTION" ]; then
  echo "❌ Error: No task description provided for readiness check."
  exit 1
fi

echo "🔍 Running BMAD Readiness Check..."

HAS_BASE=$(echo "$TASK_DESCRIPTION" | grep -i "base" | wc -l)
HAS_MODEL=$(echo "$TASK_DESCRIPTION" | grep -i "model" | wc -l)
HAS_ACTION=$(echo "$TASK_DESCRIPTION" | grep -i "action" | wc -l)
HAS_DATA=$(echo "$TASK_DESCRIPTION" | grep -i "data" | wc -l)

STATUS=0

if [ $HAS_BASE -eq 0 ]; then echo "⚠️  Missing 'Base' definition."; STATUS=1; fi
if [ $HAS_MODEL -eq 0 ]; then echo "⚠️  Missing 'Model' definition."; STATUS=1; fi
if [ $HAS_ACTION -eq 0 ]; then echo "⚠️  Missing 'Action' definition."; STATUS=1; fi
if [ $HAS_DATA -eq 0 ]; then echo "⚠️  Missing 'Data' definition."; STATUS=1; fi

if [ $STATUS -eq 0 ]; then
  echo "✅ Readiness Check Passed: Task adheres to BMAD method."
  exit 0
else
  echo "🛑 Readiness Check Failed: Please structure the task using the BMAD method."
  exit 1
fi
