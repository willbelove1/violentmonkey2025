import '../mock';
import { prepare } from '@/background/utils/preinject';

describe('Manifest V3 background script', () => {
  beforeAll(() => {
    global.browser = {
      ...global.browser,
      webNavigation: {
        onCompleted: {
          addListener: jest.fn(),
          dispatch: jest.fn(),
        },
      },
    };
  });

  it('should inject scripts on navigation', async () => {
    const tabId = 123;
    const url = 'https://example.com/';
    const details = {
      tabId,
      url,
      frameId: 0,
    };
    const prepareSpy = jest.spyOn(global, 'prepare');
    global.browser.webNavigation.onCompleted.dispatch(details);
    expect(prepareSpy).toHaveBeenCalledWith(url, url, true);
  });
});
