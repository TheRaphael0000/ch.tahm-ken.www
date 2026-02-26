FROM alpine:latest

WORKDIR /app

# install nodejs
RUN apk add nodejs npm --no-cache

# install python
RUN apk add python3 --no-cache

# install rust
RUN apk add --no-cache \
    curl \
    build-base \
    gcc
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
ENV PATH="/root/.cargo/bin:${PATH}"
RUN rustup target add wasm32-unknown-unknown
RUN curl -L --proto '=https' --tlsv1.2 -sSf https://raw.githubusercontent.com/cargo-bins/cargo-binstall/main/install-from-binstall-release.sh | sh
RUN cargo install wasm-pack

# install rsync
RUN apk add rsync --no-cache

COPY ./package*.json .
COPY ./svelte.config.js .
COPY ./vite.config.ts .
COPY ./tsconfig.json .
COPY ./docker_build.sh .
COPY ./cache cache
COPY ./wasm-optimizer wasm-optimizer
COPY ./static static
COPY ./src src

CMD ["sh", "./docker_build.sh"]