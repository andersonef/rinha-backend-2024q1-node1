FROM node:21.6.1
WORKDIR /var/app

COPY . .

#RUN apk add --update nodejs npm
RUN npm install
EXPOSE 9999
CMD ["npm", "start"]