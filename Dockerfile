FROM eclipse-temurin:17-jdk


ENV LANG C.UTF-8
ENV LC_ALL C.UTF-8


RUN mkdir -p /app
RUN mkdir -p /tmp/compiler

WORKDIR /app

COPY build/libs/*.jar app.jar

ENV JAVA_OPTS="-Djava.security.egd=file:/dev/./urandom -Dfile.encoding=UTF-8"

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]