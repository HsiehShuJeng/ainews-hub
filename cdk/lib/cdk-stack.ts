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
      bucketName: 'ai-news-tokenawsstackid10',
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

    // Create cache policy for video files - optimized for video streaming
    const videoCachePolicy = new cloudfront.CachePolicy(this, 'VideoCachePolicy', {
      cachePolicyName: 'VideoStreamingCachePolicy',
      comment: 'Cache policy optimized for video streaming with range requests',
      defaultTtl: cdk.Duration.days(30), // Long cache for video files
      maxTtl: cdk.Duration.days(365),
      minTtl: cdk.Duration.seconds(0),
      enableAcceptEncodingGzip: false, // Video files are already compressed
      enableAcceptEncodingBrotli: false,
      headerBehavior: cloudfront.CacheHeaderBehavior.allowList(
        'Range', // Critical for video seeking/progressive download
        'Origin',
        'Access-Control-Request-Method',
        'Access-Control-Request-Headers'
      ),
      queryStringBehavior: cloudfront.CacheQueryStringBehavior.none(),
      cookieBehavior: cloudfront.CacheCookieBehavior.none(),
    });

    // Create cache policy for SPA files (HTML, CSS, JS)
    const spaCachePolicy = new cloudfront.CachePolicy(this, 'SpaCachePolicy', {
      cachePolicyName: 'SpaFilesCachePolicy',
      comment: 'Cache policy for SPA files with shorter TTL',
      defaultTtl: cdk.Duration.hours(24),
      maxTtl: cdk.Duration.days(7),
      minTtl: cdk.Duration.seconds(0),
      enableAcceptEncodingGzip: true,
      enableAcceptEncodingBrotli: true,
      headerBehavior: cloudfront.CacheHeaderBehavior.allowList(
        'Origin',
        'Access-Control-Request-Method',
        'Access-Control-Request-Headers'
      ),
      queryStringBehavior: cloudfront.CacheQueryStringBehavior.allowList('v'), // Cache-busting parameter
      cookieBehavior: cloudfront.CacheCookieBehavior.none(),
    });

    const aiNewsCdn = new cloudfront.Distribution(this, 'aiNewsCdn', {
      defaultBehavior: {
        origin: s3Origin,
        compress: true,
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        responseHeadersPolicy: cloudfront.ResponseHeadersPolicy.CORS_ALLOW_ALL_ORIGINS,
        cachePolicy: spaCachePolicy, // Use SPA cache policy for default behavior
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD_OPTIONS,
      },
      additionalBehaviors: {
        // Video files behavior - optimized for video streaming
        '/videos/*': {
          origin: s3Origin,
          compress: false, // Don't compress video files (already compressed)
          viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          responseHeadersPolicy: cloudfront.ResponseHeadersPolicy.CORS_ALLOW_ALL_ORIGINS,
          cachePolicy: videoCachePolicy,
          allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
          cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD_OPTIONS,
        },
        // JavaScript and CSS files with cache-busting support
        '/js/*': {
          origin: s3Origin,
          compress: true,
          viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          responseHeadersPolicy: cloudfront.ResponseHeadersPolicy.CORS_ALLOW_ALL_ORIGINS,
          cachePolicy: spaCachePolicy,
          allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
          cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD_OPTIONS,
        },
        '/css/*': {
          origin: s3Origin,
          compress: true,
          viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          responseHeadersPolicy: cloudfront.ResponseHeadersPolicy.CORS_ALLOW_ALL_ORIGINS,
          cachePolicy: spaCachePolicy,
          allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
          cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD_OPTIONS,
        }
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
      prune: false, // Critical: Prevents video deletion during deployments
      exclude: ['videos/*'], // Explicitly exclude videos directory
    });
    
    s3Deployment.handlerRole.attachInlinePolicy(new iam.Policy(this, 'S3DeploymentPolicy', {
      statements: [
        new iam.PolicyStatement({
          actions: [
            's3:PutObject',
            's3:PutObjectAcl',
            's3:ListBucket',
            's3:GetBucketTagging',
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

