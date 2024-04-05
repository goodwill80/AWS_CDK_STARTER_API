import { fetchAuthSession } from "@aws-amplify/auth";
import { AuthService } from "./AuthService";
import { ListBucketsCommand, S3Client } from "@aws-sdk/client-s3";

const username = "jonathan";
const password = "iLuvu80^";

async function testAuth() {
  const service = new AuthService();
  await service.login(username, password);

  const info = await fetchAuthSession();

  const { idToken } = info.tokens ?? {};

  // console.log(idToken?.toString());
  // console.log(info.identityId);
  const getCredentials = await service.generateTemporaryCredentials(
    idToken?.toString(),
    info.identityId
  );
  const credentials = {
    accessKeyId: getCredentials.Credentials.AccessKeyId,
    secretAccessKey: getCredentials.Credentials.SecretKey,
    sessionToken: getCredentials.Credentials.SessionToken,
  };
  console.log(credentials);

  // console.log(credentials.Credentials);

  // return idToken;

  const buckets = await listBuckets(credentials);
  console.log(buckets);
  return buckets;
}

async function listBuckets(credentials: any) {
  const client = new S3Client({
    credentials,
  });
  const command = new ListBucketsCommand();
  const result = await client.send(command);
  return result;
}

testAuth();
