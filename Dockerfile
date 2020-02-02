FROM alpine

RUN apk add --update nodejs npm

COPY . .
RUN npm install
CMD [ "npm", "start" ]
