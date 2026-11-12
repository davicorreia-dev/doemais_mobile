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

detect_ip() {
  if command -v ip >/dev/null 2>&1; then          # Linux
    ip route get 1.1.1.1 2>/dev/null | awk '{for(i=1;i<=NF;i++) if($i=="src") print $(i+1)}' | head -1
  elif command -v ipconfig >/dev/null 2>&1; then   # macOS
    ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null
  fi
}
export HOST_IP="${HOST_IP:-$(detect_ip)}"
[ -z "$HOST_IP" ] && { echo "Não consegui detectar o IP. Rode: HOST_IP=192.168.x.x ./run.sh $MODE"; exit 1; }

# Segredo JWT próprio de cada máquina (não vai pro git). Trocar o valor invalida os tokens locais.
if [ ! -f .env ] || ! grep -q '^ACCESS_TOKEN_SECRET=.' .env; then
  SECRET="$( (openssl rand -hex 32 2>/dev/null) || head -c 32 /dev/urandom | od -An -tx1 | tr -d ' \n')"
  echo "ACCESS_TOKEN_SECRET=$SECRET" >> .env
  echo "Gerei um ACCESS_TOKEN_SECRET novo em .env"
fi

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
echo "Se o app já estava aberto no celular (ou trocou de modo): feche-o por completo e reabra, senão ele segue com o JS/API antigos."
docker compose "${PROFILE[@]}" up --build -V "$@"
