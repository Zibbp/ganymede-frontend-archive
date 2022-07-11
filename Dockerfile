FROM node:16-alpine

RUN mkdir -p /usr/src/ganymede
WORKDIR /usr/src/ganymede
COPY . .

RUN npm ci && npm cache clean --force
RUN npm run build

ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000

EXPOSE 3000

ENTRYPOINT ["node", ".output/server/index.mjs"]