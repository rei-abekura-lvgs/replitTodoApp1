import { Amplify } from 'aws-amplify';

export const configureAmplify = () => {
  // 環境変数が設定されているか確認
  const endpoint = import.meta.env.VITE_AWS_APPSYNC_ENDPOINT || '';
  const region = import.meta.env.VITE_AWS_REGION || 'us-east-1'; // デフォルト値を設定
  const apiKey = import.meta.env.VITE_AWS_APPSYNC_API_KEY || '';
  
  // デモモードかどうかを検出（環境変数が設定されていない場合）
  const isDemo = !endpoint || !apiKey;
  
  if (isDemo) {
    console.log('AWS AppSync設定：環境変数が設定されていないため、デモモードで実行します');
    return; // 設定せずに終了
  }

  Amplify.configure({
    // AppSync (GraphQL) の設定
    API: {
      GraphQL: {
        endpoint,
        region,
        apiKey,
        defaultAuthMode: 'apiKey'
      }
    }
  });
  
  console.log('AWS AppSync設定：正常に構成されました');
};