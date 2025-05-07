import { Amplify } from 'aws-amplify';

export const configureAmplify = () => {
  Amplify.configure({
    // AppSync (GraphQL) の設定
    API: {
      GraphQL: {
        endpoint: process.env.VITE_AWS_APPSYNC_ENDPOINT,
        region: process.env.VITE_AWS_REGION,
        apiKey: process.env.VITE_AWS_APPSYNC_API_KEY,
        defaultAuthMode: 'apiKey'
      }
    }
  });
};