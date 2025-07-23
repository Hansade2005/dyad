import { togetherChatCompletion, TogetherChatMessage } from '../togetherApi';

describe('togetherChatCompletion', () => {
  it('should return a string response from the API', async () => {
    const messages: TogetherChatMessage[] = [
      { role: 'user', content: 'Say hello world.' }
    ];
    const response = await togetherChatCompletion(messages);
    expect(typeof response).toBe('string');
    expect(response.length).toBeGreaterThan(0);
  });
});

describe('selectRelevantFilesWithTogether', () => {
  it('should return an array of file paths from a mock response', async () => {
    // Mock togetherChatCompletion for this test
    const mock = jest.spyOn(require('../togetherApi'), 'togetherChatCompletion').mockResolvedValue('["src/index.ts","src/utils/helpers.ts"]');
    const { selectRelevantFilesWithTogether } = require('../codebase');
    const files = [
      { path: 'src/index.ts', summary: 'Main entry point' },
      { path: 'src/utils/helpers.ts', summary: 'Helper functions' },
      { path: 'src/unused.ts', summary: 'Unused file' }
    ];
    const result = await selectRelevantFilesWithTogether('How does the app start?', files);
    expect(result).toEqual(['src/index.ts', 'src/utils/helpers.ts']);
    mock.mockRestore();
  });
});
