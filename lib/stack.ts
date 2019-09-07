import {
  CloudFrontWebDistribution,
  OriginProtocolPolicy,
} from "@aws-cdk/aws-cloudfront"
import { Bucket } from "@aws-cdk/aws-s3"
import * as cdk from "@aws-cdk/core"
import { Aws, CfnOutput } from "@aws-cdk/core"

export enum Output {
  BucketName = "BucketName",
  DistributionId = "DistributionId",
  DistributionDomainName = "DistributionDomainName",
}

export type StackProps = cdk.StackProps & {
  /**
   * Physical name of the bucket.
   *
   * @example
   * "cool-website-bucket"
   */
  bucketName: string

  /**
   * Path to the bucket's default documents (i.e. `index.html`/`404.html`).
   *
   * @example
   * undefined ( -> "/index.html" )
   * "master"  ( -> "/master/index.html" )
   */
  defaultRoot?: string

  /**
   * The domain name with an alias record for this cloudfront distribution.
   *
   * @example
   * "website.cool"
   */
  domainName: string

  /**
   * ARN of an AWS Certificate Manager certificate for `domainName`.
   *
   * @example
   * "arn:aws:acm:<region>:<account-id>:certificate/<certificate-id>"
   */
  acmCertRef: string
}

export class Stack extends cdk.Stack {
  constructor(app: cdk.App, id: string, props: StackProps) {
    super(app, id, props)

    const { bucketName, defaultRoot, domainName, acmCertRef } = props

    const defaultDocument = (document: string) =>
      defaultRoot ? [defaultRoot, document].join("/") : document

    const bucket = new Bucket(this, "Bucket", {
      bucketName,
      websiteIndexDocument: defaultDocument("index.html"),
      websiteErrorDocument: defaultDocument("404.html"),
      publicReadAccess: true,
    })

    const distribution = new CloudFrontWebDistribution(this, "Distribution", {
      aliasConfiguration: { names: [domainName], acmCertRef },
      defaultRootObject: "", // CDK defaults to `index.html`, overriding S3
      originConfigs: [
        {
          behaviors: [{ isDefaultBehavior: true }],
          customOriginSource: {
            domainName: `${bucketName}.s3-website.${Aws.REGION}.amazonaws.com`,
            originProtocolPolicy: OriginProtocolPolicy.HTTP_ONLY,
          },
        },
      ],
    })

    new CfnOutput(this, Output.BucketName, {
      exportName: Output.BucketName,
      value: bucket.bucketName,
    })

    new CfnOutput(this, Output.DistributionId, {
      exportName: Output.DistributionId,
      value: distribution.distributionId,
    })

    new CfnOutput(this, Output.DistributionDomainName, {
      exportName: Output.DistributionDomainName,
      value: distribution.domainName,
    })
  }
}
