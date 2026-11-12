#!/usr/bin/env bash
# Sobe o projeto com Docker, escolhendo qual API o app usa.
#
#   ./run.sh --local   banco + backend + Expo, API local (padrão)
#   ./run.sh --render  só o Expo, API no Render
#
# Argumentos extras vão para o "docker compose up". Ex.: ./run.sh --render -d
# Variáveis opcionais: HOST_IP (IP do PC na rede), RENDER_URL.
set -e
cd "$(dirname "$0")"

MODE=local
case "${1:-}" in
  --local)  MODE=local;  shift ;;
  --render) MODE=render; shift ;;
  -h|--help) sed -n 2,8p "$0"; exit 0 ;;
esac

export HOST_IP="${HOST_IP:-$(ip route get 1.1.1.1 2>/dev/null | awk '{for(i=1;i<=NF;i++) if($i=="src") print $(i+1)}' | head -1)}"
[ -z "$HOST_IP" ] && { echo "Não consegui detectar o IP. Rode: HOST_IP=192.168.x.x ./run.sh $MODE"; exit 1; }

if [ "$MODE" = render ]; then
  export API_URL="${RENDER_URL:-https://doemais-mobile.onrender.com}"
  # libera as portas do modo local, se estiverem rodando
  docker compose stop backend db >/dev/null 2>&1 || true
  PROFILE=()
else
  export API_URL="http://$HOST_IP:3000"
  PROFILE=(--profile local)
fi

echo "Modo: $MODE | API: $API_URL | Expo: exp://$HOST_IP:8081"
echo "(QR code nos logs do serviço 'frontend')"
docker compose "${PROFILE[@]}" up --build -V "$@"
