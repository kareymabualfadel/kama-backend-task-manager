# Phase 2 — intentionally simple & insecure
FROM node:20

WORKDIR /app

# Copy dependency files first
COPY backend/package*.json ./backend/

# Install deps
RUN cd backend && npm install

# Copy backend + frontend
COPY backend ./backend
COPY frontend ./frontend

EXPOSE 3000

CMD ["node", "backend/server.js"]
