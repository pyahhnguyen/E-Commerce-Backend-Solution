#!/bin/bash

# Shop E-commerce Deployment Script
# Usage: ./scripts/deploy.sh [dev|prod|k8s]

set -e

ENVIRONMENT=${1:-dev}
PROJECT_NAME="shop-ecommerce"

echo "🚀 Deploying $PROJECT_NAME in $ENVIRONMENT mode..."

case $ENVIRONMENT in
  "dev")
    echo "📦 Starting development environment..."
    docker-compose up --build -d
    docker-compose --profile dev up -d
    echo "✅ Development environment is ready!"
    echo "🌐 API: http://localhost:3055"
    echo "🔍 Redis Commander: http://localhost:8081"
    echo "🍃 Mongo Express: http://localhost:8082"
    ;;
    
  "prod")
    echo "🏭 Starting production environment..."
    docker-compose -f docker-compose.prod.yml up --build -d
    echo "✅ Production environment is ready!"
    echo "🌐 API: http://localhost"
    ;;
    
  "k8s")
    echo "☸️  Deploying to Kubernetes..."
    
    # Apply namespace
    kubectl apply -f kubernetes/namespace.yaml
    
    # Apply configs and secrets
    kubectl apply -f kubernetes/configmap.yaml
    
    # Apply PVCs
    kubectl apply -f kubernetes/storage.yaml
    
    # Deploy services
    kubectl apply -f kubernetes/mongodb-deployment.yaml
    kubectl apply -f kubernetes/redis-deployment.yaml
    kubectl apply -f kubernetes/api-deployment.yaml
    kubectl apply -f kubernetes/ingress.yaml
    
    echo "✅ Kubernetes deployment completed!"
    echo "⏳ Waiting for pods to be ready..."
    kubectl wait --for=condition=ready pod -l app=shop-ecommerce-api -n shop-ecommerce --timeout=300s
    ;;
    
  *)
    echo "❌ Invalid environment. Use: dev, prod, or k8s"
    exit 1
    ;;
esac

echo "🎉 Deployment completed successfully!"
