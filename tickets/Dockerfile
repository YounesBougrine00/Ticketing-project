FROM node:alpine

WORKDIR /app
COPY package.json .
RUN npm isntall --only=prod
COPY . .

CMD ["npm","start"]