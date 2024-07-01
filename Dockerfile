FROM node:20

WORKDIR /app

COPY package*.json /app

RUN npm install @ng-select/ng-select@11.0.0 --force

COPY . /app

RUN npm run build --prod

EXPOSE 4200

ENTRYPOINT ["npm", "start"]
