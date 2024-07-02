# Usar nginx como base
FROM nginx:alpine

# Copiar la carpeta de construcción al directorio correcto para nginx
COPY dist/my-app/browser /usr/share/nginx/html

# Exponer el puerto 4200
EXPOSE 4200

ENTRYPOINT ["npm", "start"]

#docker build -t angelolm/unificado .
#docker run -p 4200:4200 angelolm/unificado 