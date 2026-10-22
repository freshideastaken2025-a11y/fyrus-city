FROM node:22-alpine
WORKDIR /app
COPY server.mjs ./server.mjs
COPY index.html ./public/index.html
COPY fyrus-plus.js ./public/fyrus-plus.js
COPY fyrus-world.js ./public/fyrus-world.js
COPY fyrus-intro.js ./public/fyrus-intro.js
COPY fyrus-arena.js ./public/fyrus-arena.js
COPY vector-bay.html ./public/vector-bay.html
COPY fyrus-country.js ./public/fyrus-country.js
COPY fyrus-hall.js ./public/fyrus-hall.js
COPY fyrus-home3d.js ./public/fyrus-home3d.js
COPY fyrus-mall3d.js ./public/fyrus-mall3d.js
COPY fyrus-perf.js ./public/fyrus-perf.js
COPY fyrus-atmos.js ./public/fyrus-atmos.js
COPY fyrus-hud.js ./public/fyrus-hud.js
COPY fyrus-vectorbay.js ./public/fyrus-vectorbay.js
COPY fyrus-growth.js ./public/fyrus-growth.js
COPY fyrus-tw.css ./public/fyrus-tw.css
COPY vendor ./public/vendor
ENV PORT=80 DATA_DIR=/data PUBLIC_DIR=/app/public NODE_ENV=production
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s CMD wget -qO- http://127.0.0.1/health || exit 1
CMD ["node", "server.mjs"]
