# development stage
FROM node:lts as development

WORKDIR /app

COPY package.json .

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
EXPOSE 4173
RUN npm run build
# assumes the default SvelteKit host and port
ENV ORIGIN=https://hafen-planungstool.seefalke.info


CMD ["node", "build"]

