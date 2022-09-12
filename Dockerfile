# Use an official node.js runtime as a parent image
FROM node:lts-bullseye-slim

# create /src directory
RUN mkdir /src

# Set the working directory to /src
WORKDIR /src

# Bundle app source
COPY . /src/

# override shell
SHELL [ "/bin/bash", "-cli" ]

# start node process
CMD [ "node", "tick.js" ]