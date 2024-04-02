import { AnyRecord } from "dns";
import { handler } from "../src/services/spaces/handler";

process.env.AWS_REGION = "ap-southeast-1";
process.env.TABLE_NAME = "SpaceTable-021149a4371f";

handler(
  {
    httpMethod: "POST",
    // queryStringParameters: {
    //   id: "4dba9ed4-4a8a-4ceb-bc7a-005826eec233",
    // },
    body: JSON.stringify({
      location: "Malaysia",
    }),
  } as any,
  {} as any
);
