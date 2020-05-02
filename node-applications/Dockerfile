FROM node:12.16.3-alpine
LABEL maintainer="kubek93 <jakub.michnowicz@gmail.com>"

# Install pm2
RUN npm install pm2 -g

# Bundle APP files
COPY dns-changer dns-changer/
# COPY package.json .
COPY pm2.json .

# Install app dependencies
ENV NPM_CONFIG_LOGLEVEL error
ENV DNSCHANGER_CRON_INTERVAL '* * * * *'
ENV DNSCHANGER_CLOUDFLARE_USERNAME xxx
ENV DNSCHANGER_CLOUDFLARE_KEY xxx
ENV DNSCHANGER_CLOUDFLARE_SEARCH_NAME xxx
ENV DNSCHANGER_CLOUDFLARE_ZONE_ID xxx

RUN cd dns-changer && npm install --production

# Expose ports needed to use Keymetrics.io
EXPOSE 80 443 43554

CMD [ "pm2-runtime", "start", "pm2.json" ]
