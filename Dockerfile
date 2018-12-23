FROM node:10.13-alpine
ENV NODE_ENV production
ENV DB_URL=mongodb://friendsdbservice/friendsdb
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent && mv node_modules ../
COPY . .
EXPOSE 3000
CMD node index.js