import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create the S3 bucket with a unique name based on the stack ID
    const bucket = new s3.Bucket(this, 'AiNewsBucket', {
      bucketName: `ai-news-${cdk.Stack.of(this).stackId.toLowerCase()}`.replace(/[^a-z0-9-]/g, ''),
      removalPolicy: cdk.RemovalPolicy.DESTROY, // Change as needed
      autoDeleteObjects: true, // Only for dev/test
      publicReadAccess: false
    });

    // Create a CloudFront distribution with the S3 bucket as the origin
    const oac = new cloudfront.S3OriginAccessControl(this, 'AiNewsOAC', {
      description: 'Allow CloudFront to access S3',
      originAccessControlName: 'AiNewsOAC',
      signing: cloudfront.Signing.SIGV4_NO_OVERRIDE
    });

    const s3Origin = origins.S3BucketOrigin.withOriginAccessControl(bucket, {
      originAccessControl: oac
    });

    const aiNewsCdn =new cloudfront.Distribution(this, 'aiNewsCdn', {
      defaultBehavior: {
        origin: s3Origin
      },
    });

    // Deploy static files from ../spa to the S3 bucket
    new s3deploy.BucketDeployment(this, 'DeploySpaStaticFiles', {
      sources: [s3deploy.Source.asset('../spa')],
      destinationBucket: bucket,
      distribution: aiNewsCdn,
      distributionPaths: ['/*'],
    });

    new cdk.CfnOutput(this, 'AiNewsBucketName', {
      value: bucket.bucketName,
      description: 'The name of the S3 bucket'
    });

    new cdk.CfnOutput(this, 'CdnDomainName', {
      value: aiNewsCdn.domainName,
      description: 'The domain name of the CloudFront distribution'
    });
  }
}

