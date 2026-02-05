#!/bin/bash

# Ralph Agent Loop
# Spawns Claude instances to work through user stories in prd.json

set -e

PROJECT_DIR="/Users/bowenli/development/polymarket_api/polymarket-learn-ui"
MAX_ITERATIONS=${1:-15}
ITERATION=0

cd "$PROJECT_DIR"

echo "=========================================="
echo "  Ralph Agent Loop Starting"
echo "  Max iterations: $MAX_ITERATIONS"
echo "=========================================="

while [ $ITERATION -lt $MAX_ITERATIONS ]; do
    ITERATION=$((ITERATION + 1))

    # Check if all stories are complete
    REMAINING=$(cat prd.json | jq '[.userStories[] | select(.passes == false)] | length')

    if [ "$REMAINING" -eq 0 ]; then
        echo ""
        echo "=========================================="
        echo "  ALL STORIES COMPLETE!"
        echo "  Total iterations: $ITERATION"
        echo "=========================================="
        exit 0
    fi

    # Get next story
    NEXT_STORY=$(cat prd.json | jq -r '.userStories[] | select(.passes == false) | .id + ": " + .title' | head -1)

    echo ""
    echo "=========================================="
    echo "  Iteration $ITERATION of $MAX_ITERATIONS"
    echo "  Remaining stories: $REMAINING"
    echo "  Next: $NEXT_STORY"
    echo "=========================================="

    # Run Claude with the Ralph agent instructions
    claude --print "Read scripts/ralph/CLAUDE.md for instructions. Then implement the next incomplete story from prd.json. After implementing, verify with typecheck and build, commit if passing, and update prd.json to mark the story as passes: true."

    # Check for handoff signal in the output
    if [ -f handoff.json ]; then
        REASON=$(cat handoff.json | jq -r '.reason // "unknown"')
        if [ "$REASON" == "context_threshold" ]; then
            echo ""
            echo "Context threshold reached. Spawning fresh instance..."
            rm -f handoff.json
        fi
    fi

    sleep 2
done

echo ""
echo "=========================================="
echo "  Max iterations reached ($MAX_ITERATIONS)"
echo "  Check prd.json for remaining stories"
echo "=========================================="
