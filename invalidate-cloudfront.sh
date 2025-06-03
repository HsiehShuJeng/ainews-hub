#!/bin/bash

# CloudFront invalidation script
DISTRIBUTION_ID="EGK86P1U4WHHV"
PROFILE="scott.hsieh"

# Create invalidation for all paths
aws cloudfront create-invalidation \
  --distribution-id $DISTRIBUTION_ID \
  --paths "/*" \
  --profile $PROFILE

echo "Invalidation request submitted for distribution $DISTRIBUTION_ID using profile $PROFILE"