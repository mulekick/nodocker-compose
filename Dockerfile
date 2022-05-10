# Use an official node.js runtime as a parent image
FROM node:16.13-bullseye-slim

# create /src directory, install busybox
RUN mkdir /src

# Set the working directory to /src
WORKDIR /src

# Bundle app source
COPY . /src/

# override shell
SHELL [ "/bin/bash", "-cli" ]

# clean bash + node script reading pipe
CMD [ "node", "tick.js" ]