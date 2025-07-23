import { selectRelevantFilesWithTogether } from '../codebase';

describe('selectRelevantFilesWithTogether integration', () => {
  it('should return relevant file paths for a real prompt (integration smoke test)', async () => {
    const files = [
      { path: 'src/index.ts', summary: 'Main entry point' },
      { path: 'src/utils/helpers.ts', summary: 'Helper functions' },
      { path: 'src/components/App.tsx', summary: 'Main React component' }
    ];
    const result = await selectRelevantFilesWithTogether('How does the app start?', files);
    expect(Array.isArray(result)).toBe(true);
    // Should return only file paths from the input
    result.forEach(f => expect(files.map(x => x.path)).toContain(f));
  }, 20000);
});
