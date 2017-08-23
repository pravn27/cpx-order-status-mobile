FROM node:4.4.5
EXPOSE 4400

ENV http_proxy "http://web-proxy.corp.hpecorp.net:8088/"
ENV https_proxy "https://web-proxy.corp.hpecorp.net:8088/"
ENV no_proxy "/var/run/docker.sock,localaddress,localhost,hpe.com,hpecorp.net,127.0.0.1,10.0.0.0/16,172.0.0.0/16"


# Proxy set up for NPM
RUN if [ ! -z "${http_proxy}" ]; then \
        echo "Using proxy => ${http_proxy}"; \
        npm config set https-proxy="${http_proxy}" --global; \
        npm config set http-proxy="${http_proxy}" --global; \
        npm config set proxy="${http_proxy}" --global; \
        npm config set strict-ssl=false --global; \
    else \
        echo 'No proxy set'; \
    fi;


RUN npm install -g cordova@5.2.0 grunt@0.4.5 grunt-cli@0.1.13 ripple ripple-emulator browserify@11.1.0


ADD package.json /usr/src/app/package.json
WORKDIR /usr/src/app/
RUN npm install

ADD . /usr/src/app/
WORKDIR /usr/src/app/

RUN cordova platform add android

CMD ["grunt", "server"]