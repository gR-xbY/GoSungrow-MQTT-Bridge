FROM node:18 AS builder
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install --omit=dev
COPY . .

FROM alpine:latest AS gosungrow-installer
RUN apk add --no-cache tar
WORKDIR /usr/src/app
COPY GoSungrow/GoSungrow-linux_arm64.tar.gz ./
RUN tar -xzf GoSungrow-linux_arm64.tar.gz && \
    mkdir -p /root/.local/bin && \
    cp GoSungrow /root/.local/bin/ && \
    rm GoSungrow-linux_arm64.tar.gz

FROM node:18-alpine
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app ./
COPY --from=gosungrow-installer /root/.local/bin/GoSungrow /usr/local/bin/
COPY GoSungrow/config.json /root/.GoSungrow/config.json
CMD ["npm", "start"]
