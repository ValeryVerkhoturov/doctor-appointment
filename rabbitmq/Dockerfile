FROM rabbitmq:3.10-management

COPY ./init-rabbitmq.sh /usr/local/bin/init-rabbitmq.sh

RUN chmod +x /usr/local/bin/init-rabbitmq.sh

ENTRYPOINT ["/usr/local/bin/init-rabbitmq.sh"]