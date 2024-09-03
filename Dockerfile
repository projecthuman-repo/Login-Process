
FROM node:18

WORKDIR /app


COPY backend/package*.json ./backend/
RUN cd backend && npm install


COPY frontend/package*.json ./frontend/
RUN cd frontend && npm install


COPY backend ./backend
COPY frontend ./frontend


RUN npm install -g concurrently


EXPOSE 4000 3002


CMD concurrently "cd backend && npm start" "cd frontend && npm start"

