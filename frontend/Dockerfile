FROM node:18-alpine as build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy application files
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built files to nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration template
COPY nginx.conf /etc/nginx/templates/default.conf.template

# Render uses PORT environment variable
ENV PORT=3000

EXPOSE 3000

# Use envsubst to replace PORT in nginx config
CMD sh -c "envsubst '\$PORT' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"
