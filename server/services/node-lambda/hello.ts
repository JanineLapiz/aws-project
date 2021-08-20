import { S3 } from "aws-sdk";

const s3Client = new S3();

const handler = async (event: any, context: any) => {
  const buckets = await s3Client.listBuckets().promise();
  console.log("THIS IS AN EVENT");
  console.log(event);
  return {
    statusCode: 200,
    body: "Here are buckets:" + JSON.stringify(buckets.Buckets),
  };
};

export { handler };
