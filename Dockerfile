FROM node:21.6.1-alpine3.18
WORKDIR /var/app

COPY . .

RUN apk add --update nodejs npm
RUN rm -rf node_modules
RUN npm install
EXPOSE 9999
CMD ["npm", "run", "start"]