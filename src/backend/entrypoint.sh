#!/bin/sh

# Apply DB migrations
COMMAND="alembic upgrade head"

# Set timeout to 60 seconds from now
END_TIME=$(($(date +%s) + 60))

# Keep trying until success or timeout
while true; do
    # Execute the command and capture both stdout and stderr
    OUTPUT=$($COMMAND 2>&1)
    EXIT_CODE=$?

    # If command succeeded, exit
    if [ $EXIT_CODE -eq 0 ]; then
        echo "DB Migrations Applied successfully!"
        fastapi run --proxy-headers  # Run app server
        exit 0
    fi

    # Check if we've exceeded timeout
    if [ $(date +%s) -ge $END_TIME ]; then
        echo "Timeout reached after 1 minute. Last error message:"
        echo "$OUTPUT"
        exit 1
    fi

    # Small sleep to prevent hammering the system
    sleep 5
done
