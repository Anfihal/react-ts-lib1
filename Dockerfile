# Стадия сборки
FROM node:lts-alpine as build-stage

WORKDIR /app

# Копируем файлы зависимостей сначала для лучшего кэширования
COPY package*.json ./
RUN npm ci

# Копируем исходный код и собираем проект
COPY . .
RUN npm run build

# Финальная стадия с Nginx
FROM nginx:alpine

# Копируем нашу кастомную конфигурацию Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Копируем собранное приложение из стадии сборки
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Открываем порт 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]