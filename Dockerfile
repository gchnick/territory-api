FROM node:20.10.0 as builder

RUN corepack enable && corepack prepare pnpm@latest --activate
ENV PNPM_HOME=/usr/local/bin

WORKDIR /usr/src/app

COPY package.*json ./

RUN pnpm install

COPY . .
RUN  pnpm run build

FROM node:20.10.0-alpine

WORKDIR /usr/src/api

COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package*.json ./

RUN adduser --disable-password apiuser
RUN chown -R apiuser:apiuser /usr/src/api
USER apiuser

CMD ["npm", "start"]
