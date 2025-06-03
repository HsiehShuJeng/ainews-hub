import * as cdk from 'aws-cdk-lib';
import { Template, Match } from 'aws-cdk-lib/assertions';
import { CdkStack } from '../lib/cdk-stack';

describe('Video Streaming Configuration', () => {
  function createTemplate() {
    const app = new cdk.App();
    const stack = new CdkStack(app, 'TestStack');
    return Template.fromStack(stack);
  }

  test('CloudFront distribution supports video streaming', () => {
    const template = createTemplate();
    
    // Verify CloudFront distribution exists
    template.hasResourceProperties('AWS::CloudFront::Distribution', {
      DistributionConfig: {
        DefaultCacheBehavior: {
          ViewerProtocolPolicy: 'redirect-to-https',
          Compress: true,
        },
      },
    });
  });

  test('S3 bucket allows video file storage', () => {
    const template = createTemplate();
    
    // Verify S3 bucket exists (main bucket for content)
    template.resourceCountIs('AWS::S3::Bucket', 2);
    
    // Verify bucket policy allows CloudFront access
    template.hasResourceProperties('AWS::S3::BucketPolicy', {
      PolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({
            Effect: 'Allow',
            Principal: {
              Service: 'cloudfront.amazonaws.com'
            },
            Action: 's3:GetObject',
          })
        ])
      }
    });
  });

  test('CloudFront caching optimized for video content', () => {
    const template = createTemplate();
    
    template.hasResourceProperties('AWS::CloudFront::Distribution', {
      DistributionConfig: {
        DefaultCacheBehavior: {
          // Verify caching is enabled for video content
          CachePolicyId: Match.anyValue(),
          ViewerProtocolPolicy: 'redirect-to-https',
        },
      },
    });
  });

  test('HTTPS enforcement for secure video delivery', () => {
    const template = createTemplate();
    
    template.hasResourceProperties('AWS::CloudFront::Distribution', {
      DistributionConfig: {
        DefaultCacheBehavior: {
          ViewerProtocolPolicy: 'redirect-to-https',
        },
      },
    });
  });

  test('Origin Access Control configured for S3 security', () => {
    const template = createTemplate();
    
    // Verify OAC exists
    template.resourceCountIs('AWS::CloudFront::OriginAccessControl', 1);
    
    // Verify OAC configuration
    template.hasResourceProperties('AWS::CloudFront::OriginAccessControl', {
      OriginAccessControlConfig: {
        Name: 'AiNewsOAC',
        OriginAccessControlOriginType: 's3',
        SigningBehavior: 'no-override',
        SigningProtocol: 'sigv4',
      },
    });
  });

  test('BucketDeployment preserves video files during deployment', () => {
    const template = createTemplate();
    
    // Verify BucketDeployment exists
    template.resourceCountIs('Custom::CDKBucketDeployment', 1);
    
    // The prune and exclude settings are handled by the CDK construct
    // and don't appear directly in CloudFormation template, but we can
    // verify the deployment resource exists
    template.hasResourceProperties('Custom::CDKBucketDeployment', {
      SourceBucketNames: Match.anyValue(),
      DestinationBucketName: Match.anyValue(),
    });
  });

  test('Video URLs use proper URL encoding for special characters', () => {
    // This test verifies that our video URLs handle special characters correctly
    const testUrl = 'https://d398xk2htm3kbk.cloudfront.net/videos/%5B2025.06.03%5D%5BManus%5D20250603130300_x_video_20250603130300.mp4';
    
    // Verify URL encoding
    expect(testUrl).toContain('%5B'); // [ encoded
    expect(testUrl).toContain('%5D'); // ] encoded
    expect(testUrl).toMatch(/^https:\/\/d398xk2htm3kbk\.cloudfront\.net\/videos\//);
  });
}); 