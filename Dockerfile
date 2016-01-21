FROM node
WORKDIR /home/microwiki
COPY ./package.json ./
RUN npm install
EXPOSE 80
ENV HTTP_PORT 80
ENTRYPOINT ["node", "wiki.js"]
COPY ./wiki.js ./
