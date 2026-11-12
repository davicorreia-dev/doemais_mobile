#!/usr/bin/env bash
# Sobe tudo (banco + backend + Expo) usando o IP do PC na rede local.
set -e
cd "$(dirname "$0")"
export HOST_IP="${HOST_IP:-$(ip route get 1.1.1.1 2>/dev/null | awk '{for(i=1;i<=NF;i++) if($i=="src") print $(i+1)}' | head -1)}"
[ -z "$HOST_IP" ] && { echo "Não consegui detectar o IP. Rode: HOST_IP=192.168.x.x ./run.sh"; exit 1; }
echo "Usando HOST_IP=$HOST_IP  (QR code do Expo nos logs do serviço 'frontend')"
docker compose up --build -V "$@"
