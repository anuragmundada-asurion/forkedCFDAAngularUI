FROM gsacsp-build02.reisys.com:5000/library/oracle-jdk8-slim
VOLUME /tmp
ADD ./app.jar app.jar
ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom","-Xmx512m","-jar","/app.jar"]
