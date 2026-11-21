FROM node:22-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts
COPY index.html vite.config.js ./
COPY src ./src
USER node
EXPOSE 4173
CMD ["sh", "-c", "npm run build -- --outDir /tmp/dist --emptyOutDir --configLoader native && exec npm run preview -- --outDir /tmp/dist --host 0.0.0.0 --configLoader native"]
