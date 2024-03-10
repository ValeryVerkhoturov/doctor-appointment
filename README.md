# Setup
1. Установить Docker
2. `npm run all`
   * Запустится команда `docker compose up --build -d`. При первой инициализации PostgreSQL запустится скрипт из ./init_db/db-fixtures.sql с созданием структуры БД и созданием фикстур. Также будет собран новый образ RabbitMQ из ./rabbitmq/Dockerfile, который при первом запуске установит плагин `rabbitmq_delayed_message_exchange` для системы уведомлений (./rabbitmq/init-rabbitmq.sh). 
   * Запустится команда `docker compose -f docker-compose.app.yml up --build -d`. Соберется Express.js приложение из ./Dockerfile. Также возможнен запуск в дев режиме `npm i && npm run dev`. При первом подключении приложение создаст в RabbitMQ notifier_exchange c типом x-delayed-message, очередь notifier_queue и биндинг exchange к queue.
3. Выполнить curl команды ниже. Если отдается Forbidden, необходимо изменить авторизационный токен в заголовках, который отдается в /api/v1/users/verifyCode
4. Остановить все `npm run all:stop`

# Logging
Logging is using winston logger and saving logs in ./logs/all.log and ./logs/error.log.

# Routes

## Send code
```shell
curl -X POST http://localhost:3000/api/v1/users/sendCode \
     -H "Content-Type: application/json" \
     -d '{"phone": "79991234567"}'
```
Success output:
```json
{
   "message": "Code sent successfully."
}
```

## Verify code
```shell
curl -X POST http://localhost:3000/api/v1/users/verifyCode \
     -H "Content-Type: application/json" \
     -d '{"code": "0000", "phone": "79991234567"}'
```
Success output:
```json
{
   "message": "User verified successfully",
   "user": {
      "id": 1,
      "username": "ann_d",
      "phone": "79991234567"
   },
   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzEwMDYxNDU3LCJleHAiOjE3NDE2MTkwNTd9.FBKtxwgVO1Iewf79IqToRQGaFufanuexqlR4elgHFlA"
}
```

## Get doctors with free visit time
```shell
curl -X GET "http://localhost:3000/api/v1/doctors/all?dateFrom=2024-04-02&dateTo=2024-04-03" \
    -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzA5OTEzNjY4LCJleHAiOjE3NDE0NzEyNjh9.hTtibzPov1DlymF-zEa0w3WAYc5fajTiM5MwhIgLyUc"
```
Success output:
```json
{
   "doctors": [
      {
         "id": 1,
         "firstName": "John",
         "lastName": "Smith",
         "surname": "Allen",
         "specializationId": 1,
         "specializationData": {
            "id": 1,
            "specName": "Cardiologist"
         },
         "freeVisitTimes": [
            {
               "timeStart": "2024-04-02T07:00:00.000Z"
            },
            {
               "timeStart": "2024-04-02T07:30:00.000Z"
            },
            {
               "timeStart": "2024-04-02T08:00:00.000Z"
            },
            {
               "timeStart": "2024-04-02T08:30:00.000Z"
            },
            {
               "timeStart": "2024-04-02T09:00:00.000Z"
            },
            {
               "timeStart": "2024-04-02T09:30:00.000Z"
            },
            {
               "timeStart": "2024-04-02T10:00:00.000Z"
            },
            {
               "timeStart": "2024-04-02T10:30:00.000Z"
            },
            {
               "timeStart": "2024-04-02T11:00:00.000Z"
            },
            {
               "timeStart": "2024-04-02T11:30:00.000Z"
            },
            {
               "timeStart": "2024-04-02T12:00:00.000Z"
            },
            {
               "timeStart": "2024-04-02T12:30:00.000Z"
            },
            {
               "timeStart": "2024-04-02T13:00:00.000Z"
            },
            {
               "timeStart": "2024-04-02T13:30:00.000Z"
            },
            {
               "timeStart": "2024-04-02T14:00:00.000Z"
            },
            {
               "timeStart": "2024-04-02T14:30:00.000Z"
            },
            {
               "timeStart": "2024-04-02T15:00:00.000Z"
            },
            {
               "timeStart": "2024-04-02T15:30:00.000Z"
            },
            {
               "timeStart": "2024-04-02T16:30:00.000Z"
            },
            {
               "timeStart": "2024-04-03T07:00:00.000Z"
            },
            {
               "timeStart": "2024-04-03T07:30:00.000Z"
            },
            {
               "timeStart": "2024-04-03T08:00:00.000Z"
            },
            {
               "timeStart": "2024-04-03T08:30:00.000Z"
            },
            {
               "timeStart": "2024-04-03T09:00:00.000Z"
            },
            {
               "timeStart": "2024-04-03T09:30:00.000Z"
            },
            {
               "timeStart": "2024-04-03T10:00:00.000Z"
            },
            {
               "timeStart": "2024-04-03T10:30:00.000Z"
            },
            {
               "timeStart": "2024-04-03T11:00:00.000Z"
            },
            {
               "timeStart": "2024-04-03T11:30:00.000Z"
            },
            {
               "timeStart": "2024-04-03T12:00:00.000Z"
            },
            {
               "timeStart": "2024-04-03T12:30:00.000Z"
            },
            {
               "timeStart": "2024-04-03T13:00:00.000Z"
            },
            {
               "timeStart": "2024-04-03T13:30:00.000Z"
            },
            {
               "timeStart": "2024-04-03T14:00:00.000Z"
            },
            {
               "timeStart": "2024-04-03T14:30:00.000Z"
            },
            {
               "timeStart": "2024-04-03T15:00:00.000Z"
            },
            {
               "timeStart": "2024-04-03T15:30:00.000Z"
            },
            {
               "timeStart": "2024-04-03T16:00:00.000Z"
            },
            {
               "timeStart": "2024-04-03T16:30:00.000Z"
            }
         ]
      },
      {
         "id": 2,
         "firstName": "Samantha",
         "lastName": "Brown",
         "surname": "Marie",
         "specializationId": 2,
         "specializationData": {
            "id": 2,
            "specName": "Dentist"
         },
         "freeVisitTimes": [
            {
               "timeStart": "2024-04-02T07:30:00.000Z"
            },
            {
               "timeStart": "2024-04-02T08:00:00.000Z"
            },
            {
               "timeStart": "2024-04-02T08:30:00.000Z"
            },
            {
               "timeStart": "2024-04-02T09:00:00.000Z"
            },
            {
               "timeStart": "2024-04-02T09:30:00.000Z"
            },
            {
               "timeStart": "2024-04-02T13:30:00.000Z"
            },
            {
               "timeStart": "2024-04-02T14:00:00.000Z"
            },
            {
               "timeStart": "2024-04-02T14:30:00.000Z"
            },
            {
               "timeStart": "2024-04-02T15:00:00.000Z"
            },
            {
               "timeStart": "2024-04-02T15:30:00.000Z"
            },
            {
               "timeStart": "2024-04-02T16:30:00.000Z"
            },
            {
               "timeStart": "2024-04-03T07:00:00.000Z"
            },
            {
               "timeStart": "2024-04-03T07:30:00.000Z"
            },
            {
               "timeStart": "2024-04-03T08:00:00.000Z"
            },
            {
               "timeStart": "2024-04-03T08:30:00.000Z"
            },
            {
               "timeStart": "2024-04-03T09:00:00.000Z"
            },
            {
               "timeStart": "2024-04-03T09:30:00.000Z"
            },
            {
               "timeStart": "2024-04-03T10:00:00.000Z"
            },
            {
               "timeStart": "2024-04-03T10:30:00.000Z"
            },
            {
               "timeStart": "2024-04-03T11:00:00.000Z"
            },
            {
               "timeStart": "2024-04-03T11:30:00.000Z"
            },
            {
               "timeStart": "2024-04-03T12:00:00.000Z"
            },
            {
               "timeStart": "2024-04-03T12:30:00.000Z"
            },
            {
               "timeStart": "2024-04-03T13:00:00.000Z"
            },
            {
               "timeStart": "2024-04-03T13:30:00.000Z"
            },
            {
               "timeStart": "2024-04-03T14:00:00.000Z"
            },
            {
               "timeStart": "2024-04-03T14:30:00.000Z"
            },
            {
               "timeStart": "2024-04-03T15:00:00.000Z"
            },
            {
               "timeStart": "2024-04-03T15:30:00.000Z"
            },
            {
               "timeStart": "2024-04-03T16:00:00.000Z"
            },
            {
               "timeStart": "2024-04-03T16:30:00.000Z"
            }
         ]
      },
      {
         "id": 3,
         "firstName": "Marcus",
         "lastName": "Wright",
         "surname": "Lee",
         "specializationId": 3,
         "specializationData": {
            "id": 3,
            "specName": "Dermatologist"
         },
         "freeVisitTimes": [
            {
               "timeStart": "2024-04-02T07:00:00.000Z"
            },
            {
               "timeStart": "2024-04-02T07:30:00.000Z"
            },
            {
               "timeStart": "2024-04-02T08:00:00.000Z"
            },
            {
               "timeStart": "2024-04-02T08:30:00.000Z"
            },
            {
               "timeStart": "2024-04-02T09:00:00.000Z"
            },
            {
               "timeStart": "2024-04-02T09:30:00.000Z"
            },
            {
               "timeStart": "2024-04-02T10:00:00.000Z"
            },
            {
               "timeStart": "2024-04-02T10:30:00.000Z"
            },
            {
               "timeStart": "2024-04-02T11:00:00.000Z"
            },
            {
               "timeStart": "2024-04-02T11:30:00.000Z"
            },
            {
               "timeStart": "2024-04-02T12:00:00.000Z"
            },
            {
               "timeStart": "2024-04-02T12:30:00.000Z"
            },
            {
               "timeStart": "2024-04-02T13:00:00.000Z"
            },
            {
               "timeStart": "2024-04-02T13:30:00.000Z"
            },
            {
               "timeStart": "2024-04-02T14:00:00.000Z"
            },
            {
               "timeStart": "2024-04-02T14:30:00.000Z"
            },
            {
               "timeStart": "2024-04-02T15:00:00.000Z"
            },
            {
               "timeStart": "2024-04-02T15:30:00.000Z"
            },
            {
               "timeStart": "2024-04-02T16:00:00.000Z"
            },
            {
               "timeStart": "2024-04-02T16:30:00.000Z"
            },
            {
               "timeStart": "2024-04-03T07:00:00.000Z"
            },
            {
               "timeStart": "2024-04-03T07:30:00.000Z"
            },
            {
               "timeStart": "2024-04-03T08:00:00.000Z"
            },
            {
               "timeStart": "2024-04-03T08:30:00.000Z"
            },
            {
               "timeStart": "2024-04-03T09:00:00.000Z"
            },
            {
               "timeStart": "2024-04-03T09:30:00.000Z"
            },
            {
               "timeStart": "2024-04-03T10:00:00.000Z"
            },
            {
               "timeStart": "2024-04-03T10:30:00.000Z"
            },
            {
               "timeStart": "2024-04-03T11:00:00.000Z"
            },
            {
               "timeStart": "2024-04-03T11:30:00.000Z"
            },
            {
               "timeStart": "2024-04-03T12:00:00.000Z"
            },
            {
               "timeStart": "2024-04-03T12:30:00.000Z"
            },
            {
               "timeStart": "2024-04-03T13:00:00.000Z"
            },
            {
               "timeStart": "2024-04-03T13:30:00.000Z"
            },
            {
               "timeStart": "2024-04-03T14:00:00.000Z"
            },
            {
               "timeStart": "2024-04-03T14:30:00.000Z"
            },
            {
               "timeStart": "2024-04-03T15:00:00.000Z"
            },
            {
               "timeStart": "2024-04-03T15:30:00.000Z"
            },
            {
               "timeStart": "2024-04-03T16:00:00.000Z"
            },
            {
               "timeStart": "2024-04-03T16:30:00.000Z"
            }
         ]
      }
   ]
}
```

## Make an appointment
```shell
curl -X POST "http://localhost:3000/api/v1/doctors/makeAppointment" \
    -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzA5OTEzNjY4LCJleHAiOjE3NDE0NzEyNjh9.hTtibzPov1DlymF-zEa0w3WAYc5fajTiM5MwhIgLyUc" \
    -H "Content-Type: application/json" \
    -d '{"doctorId": 2, "timeStart": "2025-12-12T18:30:00+03:00"}'
```
Success output:
```json
{
   "message": "Visit time successfully added.",
   "visitTime": {
      "appUserId": 1,
      "doctorId": 2,
      "timeStart": "2025-12-11T16:30:00.000Z",
      "timeEnd": "2025-12-11T17:00:00.000Z",
      "id": 54
   }
}
```
Get notifications queue http://localhost:15672/#/queues/%2F/notifier_queue. Notifications will appear after delay.

## Get all user appointments
```shell
curl -X GET "http://localhost:3000/api/v1/visitTime/all" \
    -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzA5OTEzNjY4LCJleHAiOjE3NDE0NzEyNjh9.hTtibzPov1DlymF-zEa0w3WAYc5fajTiM5MwhIgLyUc"
```
Success output:
```json
[
   {
      "id": 6,
      "doctorId": 2,
      "appUserId": 1,
      "timeStart": "2024-04-02T13:00:00.000Z",
      "timeEnd": "2024-04-02T13:30:00.000Z",
      "doctorData": {
         "id": 2,
         "firstName": "Samantha",
         "lastName": "Brown",
         "surname": "Marie",
         "specializationId": 2,
         "specializationData": {
            "id": 2,
            "specName": "Dentist"
         }
      }
   },
   {
      "id": 53,
      "doctorId": 2,
      "appUserId": 1,
      "timeStart": "2024-12-11T16:30:00.000Z",
      "timeEnd": "2024-12-11T17:00:00.000Z",
      "doctorData": {
         "id": 2,
         "firstName": "Samantha",
         "lastName": "Brown",
         "surname": "Marie",
         "specializationId": 2,
         "specializationData": {
            "id": 2,
            "specName": "Dentist"
         }
      }
   }
]
```

# Helpful commands

Check enabled RabbitMQ plugins `rabbitmq-plugins list`

RabbitMQ compatible SHA256 hash generator https://gist.github.com/ValeryVerkhoturov/ec82a5d9f74930e8d39a0a58eb83f157

Remove RabbitMQ container with volume
```shell
docker compose rm rabbitmq

docker volume rm doctor-appointment_rabbitmq_data
```


