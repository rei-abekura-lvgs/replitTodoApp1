import { Amplify } from 'aws-amplify';

export const configureAmplify = () => {
  Amplify.configure({
    // 以下はAWS AppSyncコンソールから取得する情報に置き換えてください
    aws_appsync_graphqlEndpoint: process.env.AWS_APPSYNC_ENDPOINT,
    aws_appsync_region: process.env.AWS_REGION,
    aws_appsync_authenticationType: 'API_KEY',
    aws_appsync_apiKey: process.env.AWS_APPSYNC_API_KEY,
  });
};