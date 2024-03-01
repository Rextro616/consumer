import amqp from "amqplib/callback_api";

async function connect() {
  try {
    await amqp.connect(
      "amqp://44.217.49.164",
      (err: any, conn: amqp.Connection) => {
        if (err) throw new Error(err);
        conn.createChannel((errChanel: any, channel: amqp.Channel) => {
          if (errChanel) throw new Error(errChanel);
          channel.assertQueue();
          console.log("Conexion exitosa")
          channel.consume("initial", async (data: amqp.Message | null) => {
            console.log(`cola : initial con datos: `);
            if (data?.content !== undefined) {
              const content = data?.content;
              const parsedContent = JSON.parse(content.toString());
              const headers = {
                "Content-Type": "application/json",
              };
              console.log(parsedContent)
              const body = {
                method: "POST",
                headers,
                body: JSON.stringify(parsedContent),
              };
              fetch("http://54.157.22.84:3000/rex/order", body)
                .then(() => {
                  console.log("datos enviados");
                })
                .catch((err: any) => {
                  throw new Error(err);
                });
              // enciar darps
              await channel.ack(data);
            }
          });
        });
      }
    );
  } catch (err: any) {
    throw new Error(err);
  }
}

connect();