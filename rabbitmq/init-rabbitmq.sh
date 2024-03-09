#!/bin/bash
set -e

# Setup rabbitmq_delayed_message_exchange plugin
if ! rabbitmq-plugins list -m -e | grep -q "rabbitmq_delayed_message_exchange"; then
    echo "Plugin rabbitmq_delayed_message_exchange not found, installing..."

    apt update
    apt-get install -y wget
    apt-get install -y unzip
    wget https://github.com/rabbitmq/rabbitmq-delayed-message-exchange/releases/download/3.10.0/rabbitmq_delayed_message_exchange-3.10.0.ez
    unzip ./rabbitmq_delayed_message_exchange-3.10.0.ez -d /opt/rabbitmq/plugins
else
    echo "Plugin rabbitmq_delayed_message_exchange is already installed."
fi
rabbitmq-plugins enable rabbitmq_delayed_message_exchange

exec docker-entrypoint.sh rabbitmq-server