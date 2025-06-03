// Import the data module
import { llmData } from './data.js';

describe('Veo3 Video Configuration', () => {
  const veo3Model = llmData.models.find(model => model.id === 'google_veo_3');

  test('Veo3 model exists in data', () => {
    expect(veo3Model).toBeDefined();
    expect(veo3Model.name).toBe('Google Veo 3');
  });

  test('Veo3 has demo videos configured', () => {
    expect(veo3Model.details.demoVideos).toBeDefined();
    expect(veo3Model.details.demoVideos).toHaveLength(5);
  });

  test('All demo videos use CloudFront URLs', () => {
    veo3Model.details.demoVideos.forEach((video, index) => {
      expect(video.videoUrl).toMatch(/^https:\/\/d398xk2htm3kbk\.cloudfront\.net\//);
      expect(video.name).toBe(`Veo 3 Demo ${index + 1}`);
    });
  });

  test('Video URLs use proper URL encoding for special characters', () => {
    veo3Model.details.demoVideos.forEach(video => {
      // Check that brackets are URL-encoded
      expect(video.videoUrl).toContain('%5B'); // URL-encoded [
      expect(video.videoUrl).toContain('%5D'); // URL-encoded ]
      
      // Check that no raw brackets exist
      expect(video.videoUrl).not.toContain('[');
      expect(video.videoUrl).not.toContain(']');
    });
  });

  test('Video URLs use correct path structure', () => {
    veo3Model.details.demoVideos.forEach(video => {
      expect(video.videoUrl).toMatch(/\/videos\//);
      expect(video.videoUrl).toMatch(/\.mp4$/);
    });
  });

  test('No direct S3 URLs are used', () => {
    veo3Model.details.demoVideos.forEach(video => {
      expect(video.videoUrl).not.toContain('s3.amazonaws.com');
      expect(video.videoUrl).not.toContain('amazonaws.com');
    });
  });

  test('All videos use HTTPS protocol', () => {
    veo3Model.details.demoVideos.forEach(video => {
      expect(video.videoUrl).toMatch(/^https:\/\//);
    });
  });

  test('Video filenames follow expected pattern', () => {
    const expectedPattern = /%5B2025\.06\.03%5D%5BManus%5D\d{14}_x_video_\d{14}\.mp4$/;
    
    veo3Model.details.demoVideos.forEach(video => {
      expect(video.videoUrl).toMatch(expectedPattern);
    });
  });
}); 