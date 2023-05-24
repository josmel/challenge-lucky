# Etapa de construcción
FROM node:16-alpine AS build
WORKDIR /app

# Copia los archivos de la aplicación y el archivo package.json
COPY package*.json ./
COPY . .

# Instala todas las dependencias, incluyendo las de desarrollo
RUN npm install

# Construye la aplicación
RUN npm run build

# Etapa de desarrollo
FROM node:16-alpine
WORKDIR /app

# Copia los archivos construidos desde la etapa de construcción
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package*.json ./
COPY --from=build /app/tsconfig*.json ./
COPY .env ./.env


# Comando para listar los archivos y directorios en el contenedor
RUN ls -la

# Expone el puerto en el que se ejecutará la aplicación
EXPOSE 3000

# Define el comando para ejecutar la aplicación en modo de desarrollo
CMD [ "npm", "run", "start:dev" ]
