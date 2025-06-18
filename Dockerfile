FROM debian
RUN apt-get update
RUN apt-get -y install git
RUN mkdir /tmp/build
WORKDIR /tmp/build
RUN git clone https://github.com/lets-move-to-evm/lets-move-to-evm
WORKDIR /tmp/build/lets-move-to-evm
RUN yes | ./scripts/dev_setup.sh -yptd
ENV PATH="/root/bin:/root/.cargo/bin:$PATH"
ENV DOTNET_ROOT="/root/.dotnet"
ENV PATH="/root/.dotnet/tools:$PATH"
ENV Z3_EXE="/root/bin/z3"
ENV CVC5_EXE="/root/bin/cvc5"
ENV BOOGIE_EXE="/root/.dotnet/tools/boogie"
ENV SOLC_EXE="/root/bin/solc"
RUN cargo install --path language/tools/move-cli --locked --features evm-backend
RUN mv /root/.cargo/bin/move /root/.cargo/bin/move-irm
RUN git checkout original-compiler
RUN cargo install --path language/tools/move-cli --locked --features evm-backend
RUN mv /root/.cargo/bin/move /root/.cargo/bin/move-orig

ENV NODE_VERSION=20.14.0
RUN apt install -y curl
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
ENV NVM_DIR=/root/.nvm
RUN . "$NVM_DIR/nvm.sh" && nvm install ${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm use v${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm alias default v${NODE_VERSION}
ENV PATH="/root/.nvm/versions/node/v${NODE_VERSION}/bin/:${PATH}"

COPY ./docker/hardhat-move /app/hardhat-move
COPY ./docker/hardhat-test /app/hardhat-test

WORKDIR /app/hardhat-move
RUN npm install
RUN npm run build
WORKDIR /app/hardhat-test
RUN npm install

WORKDIR /app/scripts
COPY ./docker/move ./move
RUN chmod u+x ./move
ENV PATH="/app/scripts/:$PATH"

VOLUME [ "/app/hardhat-test/contracts", "/app/hardhat-test/test", "/app/hardhat-test/libs", "/app/hardhat-test/results"]

ENTRYPOINT []
WORKDIR /app/hardhat-test
