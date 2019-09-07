import {
  CloudFrontWebDistribution,
  OriginProtocolPolicy,
} from "@aws-cdk/aws-cloudfront"
import { Bucket } from "@aws-cdk/aws-s3"
import * as cdk from "@aws-cdk/core"
import { name } from "../package.json"

const bucketName = `${name}-website`

export class Stack extends cdk.Stack {
  constructor(app: cdk.App, id: string, { env, ...props }: cdk.StackProps) {
    super(app, id, props)

    if (!env || !env.region) {
      throw new Error("env.region was undefined")
    }

    new Bucket(this, "Bucket", {
      bucketName,
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
      defaultRootObject: "", // CDK defaults to `index.html`, overriding S3
      originConfigs: [
        {
          behaviors: [{ isDefaultBehavior: true }],
          customOriginSource: {
            domainName: `${bucketName}.s3-website.${env.region}.amazonaws.com`,
            originProtocolPolicy: OriginProtocolPolicy.HTTP_ONLY,
          },
        },
      ],
    })
  }
}
