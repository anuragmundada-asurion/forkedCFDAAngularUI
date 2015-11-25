FROM gsacsp-build02.reisys.com:5000/library/oracle-jdk7-slim
VOLUME /tmp
ADD ./app.jar app.jar
ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom","-jar","/app.jar"]