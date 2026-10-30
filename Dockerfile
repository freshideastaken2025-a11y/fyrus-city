# FYRUS City — production image for the Phase 30 build (deployed from the local release candidate rc-local-30.14).
# Only browser files go into /app/public; server source, build tools and docs stay out of the served folder.
FROM node:22-alpine
WORKDIR /app
COPY server.mjs ./server.mjs
COPY index.html vector-bay.html ./public/
COPY fyrus-*.js ./public/
COPY vendor ./public/vendor
COPY assets ./public/assets
# AI citizens: no local model on the VPS -> rules + fallback answers (AI_LLM=off). FYC stay in-game credits.
ENV PORT=80 DATA_DIR=/data PUBLIC_DIR=/app/public NODE_ENV=production AI_LLM=off
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s CMD wget -qO- http://127.0.0.1/health || exit 1
CMD ["node", "server.mjs"]
