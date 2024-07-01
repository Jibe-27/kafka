FROM node

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

RUN apt-get update && \
    apt-get install -y wget default-jdk && \
    wget https://archive.apache.org/dist/kafka/2.8.0/kafka_2.13-2.8.0.tgz && \
    tar -xzf kafka_2.13-2.8.0.tgz && \
    mv kafka_2.13-2.8.0 /opt/kafka

COPY zookeeper.properties /opt/kafka/config/zookeeper.properties
COPY server.properties /opt/kafka/config/server.properties

EXPOSE 2181 9092 3000

ENV KAFKA_HOME=/opt/kafka
ENV PATH=$PATH:$KAFKA_HOME/bin

CMD \
    zookeeper-server-start.sh /opt/kafka/config/zookeeper.properties & \
    sleep 5 && \
    kafka-server-start.sh /opt/kafka/config/server.properties & \
    sleep 5 && \
    npm start
