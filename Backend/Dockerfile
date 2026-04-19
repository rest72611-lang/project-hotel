FROM node:22-alpine

WORKDIR /app

COPY ./Backend/package*.json ./

RUN npm install

COPY ./Backend ./

RUN npm run build

EXPOSE 4000

CMD ["npm", "start"]