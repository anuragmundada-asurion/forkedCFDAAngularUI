FROM java:latest
VOLUME /tmp
ADD ./app.jar app.jar
ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom","-Xmx512m","-jar","/app.jar"]
