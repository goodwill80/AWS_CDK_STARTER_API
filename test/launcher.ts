import { AnyRecord } from "dns";
import { handler } from "../src/services/spaces/handler";

process.env.AWS_REGION = "ap-southeast-1";
process.env.TABLE_NAME = "SpaceTable-021149a4371f";

handler(
  {
    httpMethod: "POST",
    // queryStringParameters: {
    //   id: "6770e619-a712-45b4-883b-bd88a6f4b04c",
    // },
    body: JSON.stringify({
      location: "Spain",
    }),
  } as any,
  {} as any
).then((result) => console.log(result));
