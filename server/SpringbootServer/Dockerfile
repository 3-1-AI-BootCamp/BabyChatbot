# build stage
FROM gradle:8.8-jdk22 AS build

WORKDIR /app

COPY . .

RUN gradle build --no-daemon



# run stage
FROM openjdk:22-jdk

WORKDIR /app

COPY --from=build /app/build/libs/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
