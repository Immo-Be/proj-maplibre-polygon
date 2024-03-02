FROM --platform=linux/amd64 nginx:alpine

RUN rm /etc/nginx/conf.d/*

# COPY ./default.conf /etc/nginx/conf.d/
# Expose the listening port
EXPOSE 80
EXPOSE 81

# Launch NGINX
CMD [ "nginx", "-g", "daemon off;" ]
