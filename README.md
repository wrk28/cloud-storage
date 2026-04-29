# Проект облачного хранилища файлов Cloud Storage

## Общее описание

Full-stack Single Page Application на базе Django/React для хранения и обмена файлами.

## Инструкция по работе

1. Можно зайти как админ
2. Можно зарегистрировать нового пользователя и зайти как новый пользователь.
3. При входе как админ доступна страница администратор и хранилище других пользователей

## Инструкция по развертыванию на сервере

1. Зайдите на сервер с помощью ssh под своей учётной записью и паролем
2. Для развёртывания потребуется установка некоторых приложений: Postgres, Python, Python-Pip, Node.js, Npm, Gunicorn, Nginx. Если они ещё не установленны, вы можете установить их с помощью команды ниже

```
sudo apt install postgresql postgresql-contrib python3 python3-pip nodejs npm gunicorn nginx
```
3. Сначала настроим базу данных. Зайдите в клиент psql
```
sudo -u postgres psql
```
Создайте пользователя админ, переключитесь на этого пользователя и создайте базу данных, выйдите из клиента. Вместо 'password' укажите нужный пароль. Также можно указать другое название базы данных вместо cloud
```
CREATE USER admin WITH PASSWORD 'password' SUPERUSER;

SET ROLE admin;

CREATE DATABASE cloud OWNER admin;

\q
```
4. Перейдите в /var/www/ и загрузите туда файлы из удалённого репозитория
```
cd /var/www

git clone https://github.com/wrk28/cloud-storage.git
```
5. Перейдите в cloud-storage и создайте файл конфигурации. Откройте файл конфигурации в редакторе
```
cd /var/www/cloud-storage

touch .env

nano .env
```
6. Запишите в файл необходимые данные, укажите SECRET_KEY для Django. DATABASE_NAME, DATABASE_USER, DATABASE_PASSWORD - это данные из шага 3. Также можете поменять путь к папке, где будут храниться файлы. Сохраните файл .env
```
SECRET_KEY=
DATABASE_NAME='cloud'
DATABASE_USER='admin'
DATABASE_PASSWORD='password'
DATABASE_HOST='127.0.0.1'
DATABASE_PORT='5432'
MEDIA_DIR='/var/www/cloud-storage/uploads/'
```
7. При необходимости, если запускаете приложение с другого сервера, зайдите в файл конфигурации в приложении React и поменяйте адрес на адрес хоста сервера. Сохраните файл.
```
cd /var/www/cloud-storage/frontend/cloud_storage

nano config.js
```
При необходимосте замените домен на нужный
```
const config =
{
  "URL": "http://168.222.142.208:8000",
  "DOWNLOAD_URL":"http://168.222.142.208/api/download/external/?link="
}

export default config;
```
8. Произведите установку необходимых пакетов с помощью npm и соберите приложение.
```
npm install

npm run build
```
9. Подготовьте Nginx к работе, отредактировав файл конфигурации
```
nano /etc/nginx/sites-available/default
```
Отредактируйте и сохраните файл. При необходимости замените домен для server_name на нужный.
```
server {
  listen 80;
  server_name 168.222.142.208;

  root /var/www/cloud-storage/frontend/cloud_storage/dist;
  index index.html;

  location / {
    try_files $uri /index.html;
  }

 location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```
10. Запустите Nginx
```
sudo systemctl start nginx

sudo systemctl enable nginx
```
11. Установите необходимые пакеты для Django, для этого перейдтие в папку Django и выполните слежующие действия
```
cd /var/www/cloud-project/backend/cloud_project
```
Создайте и активируйте виртуальное окружение и установите нужные пакеты. Не выходите из виртуального окружения
```
python3 -m venv .venv

source .venv/bin/activate

pip3 install -r requirements.txt
```
12. В той же папке создайте миграции и создайте суперпользователя c нужныем именем и паролем
```
python3 manage.py makemigrations

python3 manage.py migrate

python3 manage.py createsuperuser
```
13. Соберите статические файлы
```
python3 manage.py collectstatic 
```
14. В виртуальном окружении запустите Gunicorn
```
gunicorn --chdir /var/www/cloud-storage/backend/ cloud_storage.wsgi -b 0.0.0.0:8000
```
15. Откройте в браузере страницу по адресу домена