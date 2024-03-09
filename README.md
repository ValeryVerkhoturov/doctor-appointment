# Setup
1. Установить Docker
2. Запустить команду `docker compose up --build -d`. При первой инициализации PostgreSQL запустится скрипт из ./init_db/db-fixtures.sql с созданием структуры БД и созданием фикстур. Также будет собран новый образ RabbitMQ из ./rabbitmq/Dockerfile, который установит в базовый образ плагин `rabbitmq_delayed_message_exchange` для системы уведомлений (./rabbitmq/init-rabbitmq.sh). Проверить корректность установки плагина в контейнере можно через команду `rabbitmq-plugins list`.
3. Запуск приложения `docker compose -f=docker-compose.app.yml up --build`. Соберется Express.js приложение из ./Dockerfile. Запуск в дев режиме `npm i && npm run dev`
4. Выполнить curl команды ниже. Если отдается Forbidden, необходимо изменить авторизационный токен в заголовках, который отдается в /api/v1/users/verifyCode

# Logging
Logging is using winston logger and saving logs to ./logs/all.log and ./logs/error.log.

# Routes

## Send code
```shell
curl -X POST http://localhost:3000/api/v1/users/sendCode \
     -H "Content-Type: application/json" \
     -d '{"phone": "79991234567"}'
```
Success output:
```json
{"message":"Code sent successfully."}
```

## Verify code
```shell
curl -X POST http://localhost:3000/api/v1/users/verifyCode \
     -H "Content-Type: application/json" \
     -d '{"code": "0000", "phone": "79991234567"}'
```
Success output:
```json
{"message":"User verified successfully","user":{"id":1,"username":"ann_d","phone":"79991234567"},"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzA5OTg5NTM4LCJleHAiOjE3NDE1NDcxMzh9.mMabNt628VceNVs6dgVxQHEAgeThOIzWvukCg5GXRF4"}
```

## Get doctors with visit time
```shell
curl -X GET "http://localhost:3000/api/v1/doctors/all?dateFrom=2024-04-02&dateTo=2024-04-02" \
    -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzA5OTEzNjY4LCJleHAiOjE3NDE0NzEyNjh9.hTtibzPov1DlymF-zEa0w3WAYc5fajTiM5MwhIgLyUc"
```
Success output:
```json
{"doctors":[{"id":1,"firstName":"John","lastName":"Smith","surname":"Allen","specializationId":1,"freeVisitTimes":[{"timeStart":"2024-04-02T07:00:00.000Z"},{"timeStart":"2024-04-02T07:30:00.000Z"},{"timeStart":"2024-04-02T08:00:00.000Z"},{"timeStart":"2024-04-02T08:30:00.000Z"},{"timeStart":"2024-04-02T09:00:00.000Z"},{"timeStart":"2024-04-02T09:30:00.000Z"},{"timeStart":"2024-04-02T10:00:00.000Z"},{"timeStart":"2024-04-02T10:30:00.000Z"},{"timeStart":"2024-04-02T11:00:00.000Z"},{"timeStart":"2024-04-02T11:30:00.000Z"},{"timeStart":"2024-04-02T12:00:00.000Z"},{"timeStart":"2024-04-02T12:30:00.000Z"},{"timeStart":"2024-04-02T13:00:00.000Z"},{"timeStart":"2024-04-02T13:30:00.000Z"},{"timeStart":"2024-04-02T14:00:00.000Z"},{"timeStart":"2024-04-02T14:30:00.000Z"},{"timeStart":"2024-04-02T15:00:00.000Z"},{"timeStart":"2024-04-02T15:30:00.000Z"},{"timeStart":"2024-04-02T16:30:00.000Z"}]},{"id":2,"firstName":"Samantha","lastName":"Brown","surname":"Marie","specializationId":2,"freeVisitTimes":[{"timeStart":"2024-04-02T07:30:00.000Z"},{"timeStart":"2024-04-02T08:00:00.000Z"},{"timeStart":"2024-04-02T08:30:00.000Z"},{"timeStart":"2024-04-02T09:00:00.000Z"},{"timeStart":"2024-04-02T09:30:00.000Z"},{"timeStart":"2024-04-02T13:30:00.000Z"},{"timeStart":"2024-04-02T14:00:00.000Z"},{"timeStart":"2024-04-02T14:30:00.000Z"},{"timeStart":"2024-04-02T15:00:00.000Z"},{"timeStart":"2024-04-02T15:30:00.000Z"},{"timeStart":"2024-04-02T16:30:00.000Z"}]},{"id":3,"firstName":"Marcus","lastName":"Wright","surname":"Lee","specializationId":3,"freeVisitTimes":[{"timeStart":"2024-04-02T07:00:00.000Z"},{"timeStart":"2024-04-02T07:30:00.000Z"},{"timeStart":"2024-04-02T08:00:00.000Z"},{"timeStart":"2024-04-02T08:30:00.000Z"},{"timeStart":"2024-04-02T09:00:00.000Z"},{"timeStart":"2024-04-02T09:30:00.000Z"},{"timeStart":"2024-04-02T10:00:00.000Z"},{"timeStart":"2024-04-02T10:30:00.000Z"},{"timeStart":"2024-04-02T11:00:00.000Z"},{"timeStart":"2024-04-02T11:30:00.000Z"},{"timeStart":"2024-04-02T12:00:00.000Z"},{"timeStart":"2024-04-02T12:30:00.000Z"},{"timeStart":"2024-04-02T13:00:00.000Z"},{"timeStart":"2024-04-02T13:30:00.000Z"},{"timeStart":"2024-04-02T14:00:00.000Z"},{"timeStart":"2024-04-02T14:30:00.000Z"},{"timeStart":"2024-04-02T15:00:00.000Z"},{"timeStart":"2024-04-02T15:30:00.000Z"},{"timeStart":"2024-04-02T16:00:00.000Z"},{"timeStart":"2024-04-02T16:30:00.000Z"}]}]}
```

## Make an appointment
```shell
curl -X POST "http://localhost:3000/api/v1/doctors/makeAppointment" \
    -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzA5OTEzNjY4LCJleHAiOjE3NDE0NzEyNjh9.hTtibzPov1DlymF-zEa0w3WAYc5fajTiM5MwhIgLyUc" \
    -H "Content-Type: application/json" \
    -d '{"doctorId": 2, "timeStart": "2024-04-04T13:30:00.000Z"}'
```
Success output:
```json
{"message":"Visit time successfully added.","visitTime":{"appUserId":1,"doctorId":2,"timeStart":"2024-04-04T12:30:00.000Z","timeEnd":"2024-04-04T13:00:00.000Z","id":15}}
```
Get notifications queue http://localhost:15672/#/queues/%2F/notifier_queue. Notifications will appear after timeout

## Get all user appointments
```shell
curl -X GET "http://localhost:3000/api/v1/visitTime/all" \
    -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzA5OTEzNjY4LCJleHAiOjE3NDE0NzEyNjh9.hTtibzPov1DlymF-zEa0w3WAYc5fajTiM5MwhIgLyUc"
```
Success output:
```json
[{"id":1,"doctorId":1,"appUserId":1,"timeStart":"2024-04-01T06:00:00.000Z","timeEnd":"2024-04-01T06:30:00.000Z","doctorData":{"id":1,"firstName":"John","lastName":"Smith","surname":"Allen","specializationId":1,"specializationData":{"id":1,"specName":"Cardiologist"}}},{"id":3,"doctorId":1,"appUserId":1,"timeStart":"2024-04-02T16:00:00.000Z","timeEnd":"2024-04-02T16:30:00.000Z","doctorData":{"id":1,"firstName":"John","lastName":"Smith","surname":"Allen","specializationId":1,"specializationData":{"id":1,"specName":"Cardiologist"}}},{"id":5,"doctorId":2,"appUserId":1,"timeStart":"2024-04-02T16:00:00.000Z","timeEnd":"2024-04-02T16:30:00.000Z","doctorData":{"id":2,"firstName":"Samantha","lastName":"Brown","surname":"Marie","specializationId":2,"specializationData":{"id":2,"specName":"Dentist"}}},{"id":6,"doctorId":2,"appUserId":1,"timeStart":"2024-04-02T13:00:00.000Z","timeEnd":"2024-04-02T13:30:00.000Z","doctorData":{"id":2,"firstName":"Samantha","lastName":"Brown","surname":"Marie","specializationId":2,"specializationData":{"id":2,"specName":"Dentist"}}},{"id":7,"doctorId":2,"appUserId":1,"timeStart":"2024-04-02T10:00:00.000Z","timeEnd":"2024-04-02T10:30:00.000Z","doctorData":{"id":2,"firstName":"Samantha","lastName":"Brown","surname":"Marie","specializationId":2,"specializationData":{"id":2,"specName":"Dentist"}}},{"id":8,"doctorId":2,"appUserId":1,"timeStart":"2024-04-02T10:30:00.000Z","timeEnd":"2024-04-02T11:00:00.000Z","doctorData":{"id":2,"firstName":"Samantha","lastName":"Brown","surname":"Marie","specializationId":2,"specializationData":{"id":2,"specName":"Dentist"}}},{"id":9,"doctorId":2,"appUserId":1,"timeStart":"2024-04-02T11:30:00.000Z","timeEnd":"2024-04-02T12:00:00.000Z","doctorData":{"id":2,"firstName":"Samantha","lastName":"Brown","surname":"Marie","specializationId":2,"specializationData":{"id":2,"specName":"Dentist"}}},{"id":10,"doctorId":2,"appUserId":1,"timeStart":"2024-04-02T11:00:00.000Z","timeEnd":"2024-04-02T11:30:00.000Z","doctorData":{"id":2,"firstName":"Samantha","lastName":"Brown","surname":"Marie","specializationId":2,"specializationData":{"id":2,"specName":"Dentist"}}},{"id":11,"doctorId":2,"appUserId":1,"timeStart":"2024-04-02T12:00:00.000Z","timeEnd":"2024-04-02T12:30:00.000Z","doctorData":{"id":2,"firstName":"Samantha","lastName":"Brown","surname":"Marie","specializationId":2,"specializationData":{"id":2,"specName":"Dentist"}}},{"id":12,"doctorId":2,"appUserId":1,"timeStart":"2024-04-02T12:30:00.000Z","timeEnd":"2024-04-02T13:00:00.000Z","doctorData":{"id":2,"firstName":"Samantha","lastName":"Brown","surname":"Marie","specializationId":2,"specializationData":{"id":2,"specName":"Dentist"}}},{"id":13,"doctorId":2,"appUserId":1,"timeStart":"2024-03-02T12:30:00.000Z","timeEnd":"2024-03-02T13:00:00.000Z","doctorData":{"id":2,"firstName":"Samantha","lastName":"Brown","surname":"Marie","specializationId":2,"specializationData":{"id":2,"specName":"Dentist"}}},{"id":14,"doctorId":2,"appUserId":1,"timeStart":"2024-05-02T12:30:00.000Z","timeEnd":"2024-05-02T13:00:00.000Z","doctorData":{"id":2,"firstName":"Samantha","lastName":"Brown","surname":"Marie","specializationId":2,"specializationData":{"id":2,"specName":"Dentist"}}},{"id":15,"doctorId":2,"appUserId":1,"timeStart":"2024-04-04T12:30:00.000Z","timeEnd":"2024-04-04T13:00:00.000Z","doctorData":{"id":2,"firstName":"Samantha","lastName":"Brown","surname":"Marie","specializationId":2,"specializationData":{"id":2,"specName":"Dentist"}}}]
```

# Helpful commands

RabbitMQ compatible SHA256 hash generator https://gist.github.com/ValeryVerkhoturov/ec82a5d9f74930e8d39a0a58eb83f157

Remove RabbitMQ container with volume
```shell
docker compose rm rabbitmq

docker volume rm doctor-appointment_rabbitmq_data
```


