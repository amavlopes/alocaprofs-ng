import { SafeHtmlPipeTsPipe } from './safe-html.pipe.ts.pipe';

describe('SafeHtmlPipeTsPipe', () => {
  it('create an instance', () => {
    const pipe = new SafeHtmlPipeTsPipe();
    expect(pipe).toBeTruthy();
  });
});
