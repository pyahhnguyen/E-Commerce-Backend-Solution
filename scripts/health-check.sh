#!/bin/bash

# Health Check Script for Shop E-commerce
# Usage: ./scripts/health-check.sh [local|docker|k8s]

ENVIRONMENT=${1:-local}
BASE_URL=""

case $ENVIRONMENT in
  "local")
    BASE_URL="http://localhost:3055"
    ;;
  "docker")
    BASE_URL="http://localhost:3055"
    ;;
  "k8s")
    BASE_URL="http://$(kubectl get ingress shop-ecommerce-ingress -n shop-ecommerce -o jsonpath='{.status.loadBalancer.ingress[0].ip}')"
    ;;
esac

echo "🏥 Health Check for Shop E-commerce ($ENVIRONMENT)"
echo "🔗 Base URL: $BASE_URL"
echo "=" * 50

# Check API Health
echo "🔍 Checking API health..."
if curl -f -s "$BASE_URL/v1/api/health" > /dev/null 2>&1; then
    echo "✅ API is healthy"
else
    echo "❌ API is not responding"
fi

# Check specific endpoints
echo "🔍 Checking product endpoints..."
if curl -f -s "$BASE_URL/v1/api/product" > /dev/null 2>&1; then
    echo "✅ Product endpoint is working"
else
    echo "❌ Product endpoint is not responding"
fi

# Check Redis (if accessible)
if command -v redis-cli &> /dev/null; then
    echo "🔍 Checking Redis connection..."
    if redis-cli ping > /dev/null 2>&1; then
        echo "✅ Redis is responding"
    else
        echo "❌ Redis is not responding"
    fi
fi

# Check MongoDB (if accessible)
if command -v mongosh &> /dev/null; then
    echo "🔍 Checking MongoDB connection..."
    if mongosh --eval "db.adminCommand('ping')" --quiet > /dev/null 2>&1; then
        echo "✅ MongoDB is responding"
    else
        echo "❌ MongoDB is not responding"
    fi
fi

echo "=" * 50
echo "🏁 Health check completed"
