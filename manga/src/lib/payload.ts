// lib/payload.ts
import { getPayload, Payload } from "payload";
import config from "@/payload.config";

let payloadInstance: Payload;

export async function getPayloadClient() {
  if (!payloadInstance) {
    payloadInstance = await getPayload({ config });
  }
  return payloadInstance;
}