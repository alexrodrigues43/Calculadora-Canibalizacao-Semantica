#!/usr/bin/env bash
# ==============================================================================
# Script de Deploy Automatizado para o Google Cloud Run (Calculadora de Canibalização)
# ==============================================================================

set -e

PROJECT_ID=${1:-"blogsemantico-1750525854725"}
REGION=${2:-"us-central1"}
SERVICE_NAME="semantico-calculadora-canibalizacao"
CUSTOM_DOMAIN="calculadora-canibalizacao.semantico.com.br"

echo "=========================================================="
echo "Iniciando Deploy no Google Cloud Run"
echo "Projeto: $PROJECT_ID"
echo "Regiao: $REGION"
echo "Servico: $SERVICE_NAME"
echo "=========================================================="

API_KEY_FROM_ENV=""
if [ -f .env ]; then
  API_KEY_FROM_ENV=$(grep -E "^(GEMINI_API_KEY|BlogSemantico)=" .env | head -n 1 | cut -d '=' -f2- | tr -d '"' | tr -d "'" | tr -d '\r')
fi

API_KEY=${GEMINI_API_KEY:-${BlogSemantico:-$API_KEY_FROM_ENV}}

trap 'rm -f env.yaml' EXIT

cat <<EOF > env.yaml
NODE_ENV: "production"
DEFAULT_MODEL: "gemini-3.8-flash"
APP_URL: "https://${CUSTOM_DOMAIN}"
EOF

if [ -n "$API_KEY" ]; then
  echo "GEMINI_API_KEY: \"$API_KEY\"" >> env.yaml
  echo "BlogSemantico: \"$API_KEY\"" >> env.yaml
fi

IMAGE_TAG="us-central1-docker.pkg.dev/$PROJECT_ID/cloud-run-source-deploy/$SERVICE_NAME:latest"

echo "📦 1. Compilando container com Cloud Build..."
gcloud builds submit --tag "$IMAGE_TAG" --project="$PROJECT_ID" --quiet

echo "🚀 2. Publicando revisao no Google Cloud Run..."
gcloud run deploy "$SERVICE_NAME" \
  --image="$IMAGE_TAG" \
  --project="$PROJECT_ID" \
  --region="$REGION" \
  --platform=managed \
  --allow-unauthenticated \
  --memory=2Gi \
  --cpu=2 \
  --timeout=300 \
  --quiet \
  --env-vars-file=env.yaml

echo "Deploy no Cloud Run finalizado com sucesso!"
SERVICE_URL=$(gcloud run services describe "$SERVICE_NAME" --project="$PROJECT_ID" --region="$REGION" --format="value(status.url)")
echo "👉 URL Direta: $SERVICE_URL"
echo "👉 Subdominio: https://${CUSTOM_DOMAIN}"
