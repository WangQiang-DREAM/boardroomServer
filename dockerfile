FROM docker.ifeng.com/library/node:8.9.3-alpine


WORKDIR /ifeng-app

EXPOSE 3000

COPY . /ifeng-app

RUN npm --registry https://registry.npm.taobao.org install

CMD ["npm","start"]
