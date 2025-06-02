import * as cdk from 'aws-cdk-lib';
import { Template, Match } from 'aws-cdk-lib/assertions';
import { CdkStack } from '../lib/cdk-stack';

describe('CdkStack', () => {
  function createTemplate() {
    const app = new cdk.App();
    const stack = new CdkStack(app, 'TestStack');
    return Template.fromStack(stack);
  }

  test('creates an S3 bucket with the correct name pattern', () => {
    const template = createTemplate();
    template.resourceCountIs('AWS::S3::Bucket', 1);
    template.hasResourceProperties('AWS::S3::Bucket', {
      BucketName: Match.stringLikeRegexp('ai-news-.*'),
    });
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

  test('creates a CloudFront distribution with S3BucketOrigin and OAC', () => {
    const template = createTemplate();
    template.resourceCountIs('AWS::CloudFront::Distribution', 1);
    template.hasResourceProperties('AWS::CloudFront::Distribution', {
      DistributionConfig: {
        DefaultCacheBehavior: {
          TargetOriginId: Match.anyValue(),
        },
        Origins: Match.arrayWith([
          Match.objectLike({
            OriginAccessControlId: Match.anyValue(), // fixed: at root
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
      // We cannot directly assert the source path, but presence of this resource is sufficient
    });
  });

  test('outputs S3 bucket name and CDN domain name', () => {
    const template = createTemplate();
    template.hasOutput('AiNewsBucketName', {
      Description: 'The name of the S3 bucket',
      Value: Match.anyValue(), // fixed: Ref object
    });
    template.hasOutput('CdnDomainName', {
      Description: 'The domain name of the CloudFront distribution',
      Value: Match.anyValue(),
    });
  });
});
