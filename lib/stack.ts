import { CloudFrontWebDistribution } from "@aws-cdk/aws-cloudfront"
import { Bucket } from "@aws-cdk/aws-s3"
import * as cdk from "@aws-cdk/core"
import { name } from "../package.json"

export class Stack extends cdk.Stack {
  constructor(app: cdk.App, id: string, props: cdk.StackProps) {
    super(app, id, props)

    const bucket = new Bucket(this, "Bucket", {
      bucketName: `${name}-website`,
      websiteIndexDocument: "index.html",
      websiteErrorDocument: "404.html",
    })

    new CloudFrontWebDistribution(this, "Distribution", {
      originConfigs: [
        {
          behaviors: [{ isDefaultBehavior: true }],
          customOriginSource: {
            domainName: bucket.bucketDomainName,
          },
        },
      ],
    })
  }
}
