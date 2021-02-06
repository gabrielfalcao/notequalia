FROM node:14.15.4-alpine


# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install --silent
RUN npm install --silent -g react-scripts@3.4.1

# add app
COPY . ./

ENV NODE_ENV production
# start app
CMD ["npm", "start"]
