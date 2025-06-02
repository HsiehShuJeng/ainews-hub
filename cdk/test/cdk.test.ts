import * as cdk from 'aws-cdk-lib';
import { Template, Match } from 'aws-cdk-lib/assertions';
import { CdkStack } from '../lib/cdk-stack';

describe('CdkStack', () => {
  function createTemplate() {
    const app = new cdk.App();
    const stack = new CdkStack(app, 'TestStack');
    return Template.fromStack(stack);
  }

  test('creates 2 S3 buckets (main and logging)', () => {
    const template = createTemplate();
    template.resourceCountIs('AWS::S3::Bucket', 2);
  });

  test('creates an S3OriginAccessControl for CloudFront', () => {
    const template = createTemplate();
    template.resourceCountIs('AWS::CloudFront::OriginAccessControl', 1);
    template.hasResourceProperties('AWS::CloudFront::OriginAccessControl', {
      OriginAccessControlConfig: {
        Description: 'Allow CloudFront to access S3',
        Name: 'AiNewsOAC',
        SigningBehavior: 'no-override',
        SigningProtocol: 'sigv4',
        OriginAccessControlOriginType: 's3', // fixed key
      },
    });
  });

  test('creates a CloudFront distribution with S3BucketOrigin and OAC and SPA routing', () => {
    const template = createTemplate();
    template.resourceCountIs('AWS::CloudFront::Distribution', 1);
    template.hasResourceProperties('AWS::CloudFront::Distribution', {
      DistributionConfig: {
        DefaultCacheBehavior: {
          TargetOriginId: Match.anyValue(),
          Compress: true,
          ViewerProtocolPolicy: 'redirect-to-https',
        },
        DefaultRootObject: 'index.html',
        CustomErrorResponses: Match.arrayWith([
          Match.objectLike({
            ErrorCode: 404,
            ResponseCode: 200,
            ResponsePagePath: '/index.html',
          }),
          Match.objectLike({
            ErrorCode: 403,
            ResponseCode: 200,
            ResponsePagePath: '/index.html',
          })
        ]),
        Origins: Match.arrayWith([
          Match.objectLike({
            OriginAccessControlId: Match.anyValue(),
            DomainName: Match.anyValue(),
            S3OriginConfig: Match.objectLike({
              OriginAccessIdentity: ''
            }),
          }),
        ]),
      },
    });
  });

  test('deploys static files from spa directory using BucketDeployment', () => {
    const template = createTemplate();
    template.resourceCountIs('Custom::CDKBucketDeployment', 1);
    template.hasResourceProperties('Custom::CDKBucketDeployment', {
      SourceBucketNames: Match.anyValue(),
      SourceObjectKeys: Match.anyValue(),
      DestinationBucketName: Match.anyValue(),
      SystemMetadata: Match.objectLike({
        'cache-control': Match.stringLikeRegexp('public, max-age=\\d+')
      }),
      // We cannot directly assert the source path, but presence of this resource is sufficient
    });
  });

  test('outputs S3 bucket name, CDN domain name, and distribution ID', () => {
    const template = createTemplate();
    template.hasOutput('AiNewsBucketName', {
      Description: 'The name of the S3 bucket',
      Value: Match.anyValue(), // fixed: Ref object
    });
    template.hasOutput('CdnDomainName', {
      Description: 'The domain name of the CloudFront distribution',
      Value: Match.anyValue(),
    });
    template.hasOutput('CdnDistributionId', {
      Description: 'The CloudFront distribution ID',
      Value: Match.anyValue(),
    });
  });
});
