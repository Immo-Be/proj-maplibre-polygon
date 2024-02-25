# Use a base image
FROM node:lts

# Set the working directory
# We set the working directory to /app, s that we don't have to
# specify the full path to the files in the container.
WORKDIR /app

# Copy the package.json file to the container
# In docker, each step is cached. So, if we change the code in the app,
# the docker will not run the npm install command again, because it will
# use the cached version of the image. To avoid this, we copy the package.json
# file first, and then run the npm install command. This way, if we change the
# code, the package.json file will change as well, and the docker will run the
# npm install command again.
COPY package.json .

# Install any dependencie
RUN npm install

# Copy the app files to the container
COPY . .

# ARG DEFAULT_PORT=3000

# ENV PORT=$DEFAULT_PORT

# # Expose the necessary ports
# EXPOSE $PORT

#VOLUME ["/app/node_modules"]

# Define the command to run the app
CMD ["npm", "run", "dev"]
