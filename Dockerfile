FROM node:22-alpine
WORKDIR /app
COPY server.mjs ./server.mjs
COPY index.html ./public/index.html
COPY fyrus-plus.js ./public/fyrus-plus.js
COPY fyrus-world.js ./public/fyrus-world.js
COPY fyrus-intro.js ./public/fyrus-intro.js
ENV PORT=80 DATA_DIR=/data PUBLIC_DIR=/app/public NODE_ENV=production
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s CMD wget -qO- http://127.0.0.1/health || exit 1
CMD ["node", "server.mjs"]
