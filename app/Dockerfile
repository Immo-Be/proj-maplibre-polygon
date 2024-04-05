# development stage
FROM node:lts as development

WORKDIR /app

COPY package.json .

ARG APP_PORT
ENV VITE_PORT=$APP_PORT
EXPOSE $APP_PORT

# Install any dependencie
RUN npm install

# Copy the app files to the container
COPY . .

CMD ["npm", "run", "dev"]


# production stage
FROM --platform=linux/amd64 node:lts-alpine as production
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .

ARG APP_PORT
ARG PROD_ORIGIN

EXPOSE $APP_PORT
RUN npm run build
# assumes the default SvelteKit host and port
ENV ORIGIN=$PROD_ORIGIN

CMD ["node", "build"]



# local staging build
FROM node:lts-alpine as local_staging
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
ARG APP_PORT
ENV VITE_PORT=$APP_PORT
EXPOSE $APP_PORT
RUN npm run build
ENV ORIGIN=http://localhost:$APP_PORT

CMD ["node", "build"]