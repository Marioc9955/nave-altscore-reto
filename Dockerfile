FROM denoland/deno:2.2.11

WORKDIR /app
COPY . .

EXPOSE 3000

RUN deno cache main.ts

CMD ["run", "--allow-net", "main.ts"]
