import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as iam from 'aws-cdk-lib/aws-iam';

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create the S3 bucket with a unique name based on the stack ID
    const bucket = new s3.Bucket(this, 'AiNewsBucket', {
      bucketName: `ai-news-${cdk.Stack.of(this).stackId.toLowerCase()}`.replace(/[^a-z0-9-]/g, ''),
      removalPolicy: cdk.RemovalPolicy.RETAIN, // Change as needed
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

    const aiNewsCdn = new cloudfront.Distribution(this, 'aiNewsCdn', {
      defaultBehavior: {
        origin: s3Origin,
        compress: true,
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      defaultRootObject: 'index.html',
      errorResponses: [
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
          ttl: cdk.Duration.minutes(5),
        },
        {
          httpStatus: 403,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
          ttl: cdk.Duration.minutes(5),
        }
      ],
      enableLogging: true,
    });

    // Deploy static files from ../spa to the S3 bucket
    const s3Deployment = new s3deploy.BucketDeployment(this, 'DeploySpaStaticFiles', {
      sources: [s3deploy.Source.asset('../spa')],
      destinationBucket: bucket,
      distribution: aiNewsCdn,
      distributionPaths: ['/*'],
      cacheControl: [
        s3deploy.CacheControl.setPublic(),
        s3deploy.CacheControl.maxAge(cdk.Duration.days(30)),
      ],
      prune: true,
    });
    s3Deployment.handlerRole.attachInlinePolicy(new iam.Policy(this, 'S3DeploymentPolicy', {
      statements: [
        new iam.PolicyStatement({
          actions: [
            's3:PutObject',
            's3:PutObjectAcl',
            's3:ListBucket',
            's3:GetBucketTagging', // <-- add this
            's3:GetObject',
            's3:DeleteObject',
            's3:GetBucketLocation',
            's3:GetLifecycleConfiguration',
            's3:PutLifecycleConfiguration',
            's3:DeleteBucket',
            's3:GetBucketPolicy'
          ],
          resources: [bucket.bucketArn, `${bucket.bucketArn}/*`],
        }),
      ],
    }));

    new cdk.CfnOutput(this, 'AiNewsBucketName', {
      value: bucket.bucketName,
      description: 'The name of the S3 bucket'
    });

    new cdk.CfnOutput(this, 'CdnDomainName', {
      value: aiNewsCdn.domainName,
      description: 'The domain name of the CloudFront distribution'
    });

    new cdk.CfnOutput(this, 'CdnDistributionId', {
      value: aiNewsCdn.distributionId,
      description: 'The CloudFront distribution ID'
    });
  }
}

