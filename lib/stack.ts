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
      publicReadAccess: true,
    })

    new CloudFrontWebDistribution(this, "Distribution", {
      aliasConfiguration: {
        names: ["cdk-workbench.ziorobo.co"],
        acmCertRef:
          "arn:aws:acm:us-east-1:203242799745:certificate/97978590-a0d3-4584-aa59-daed83e6e520",
      },
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
