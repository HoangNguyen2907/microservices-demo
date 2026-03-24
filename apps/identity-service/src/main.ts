import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { join } from "path";
import { AppModule } from "./app.module";

async function bootstrap() {
    // Proto path relative to workspace root (process.cwd())
    const protoPath = join(process.cwd(), "libs/proto/src/lib/identity.proto");

    const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
        transport: Transport.GRPC,
        options: {
            package: "identity",
            protoPath,
            url: "0.0.0.0:5001",
        },
    });

    await app.listen();
    console.log("=========================================");
    console.log("[IDENTITY-SERVICE] gRPC Server started");
    console.log("[IDENTITY-SERVICE] Listening on port 5001");
    console.log("=========================================");
}

bootstrap();
