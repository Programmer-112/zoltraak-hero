import { context, reddit } from '@devvit/web/server';

export const createPost = async () => {
  const { subredditName } = context;
  if (!subredditName) {
    throw new Error('subredditName is required');
  }

  return await reddit.submitCustomPost({
    splash: {
      // Splash Screen Configuration
      appDisplayName: 'Zoltraak Hero',
      backgroundUri: 'splash.jpg',
      buttonLabel: 'Tap to Start',
      description: 'Press the correct arrows as fast as you can',
      heading: 'Zoltraak Hero',
      appIconUri: 'icon.png',
    },
    postData: {
      gameState: 'initial',
      score: 0,
    },
    subredditName: subredditName,
    title: 'Zoltraak Hero',
  });
};
