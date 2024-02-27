FROM node:20-alpine

RUN apk add --no-cache libc6-compat

RUN mkdir /app && chown node:node /app
WORKDIR /app

ENV NODE_ENV development

COPY --chown=node:node . .
RUN echo $(ls -1 .)


RUN yarn install --frozen-lockfile

USER node