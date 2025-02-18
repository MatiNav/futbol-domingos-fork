import HomePageContent from "./components/Home";
import { getPichichis } from "./features/players/utils";
import { getPlayersWithStats } from "./features/players/utils/server";
import { getMessages } from "./utils/server/messages";

/**
 * EC2 => Vercel
 * Api Gateway => Routes
 * Lambda => Functions from routes
 * S3 => Static files
 * Step Functions => Inserting messages + Triggering EventBridge
 * EventBridge => Triggering the channel with the new message
 * CloudWatch (Logs) => Logs
 * Cognito => User authentication
 * DynamoDB + RDS => MongoDB
 * SNS + SQS => Notifications
 * App Sync => ?? Explore
 * Redis => Cache (messages maybe? or whatever)
 * Kinesis => Streams
 * CodePipeline => CI/CD + CodeBuild => Build + CodeDeploy => Deploy
 * CloudFormation => Infrastructure as Code
 */

export default async function HomePage() {
  const [initialMessages, playersWithStats] = await Promise.all([
    getMessages(),
    getPlayersWithStats(),
  ]);

  const pichichis = getPichichis(playersWithStats);
  const topPlayer = playersWithStats[0];

  return (
    <HomePageContent
      initialMessages={initialMessages}
      playersWithStats={playersWithStats}
      pichichis={pichichis}
      topPlayer={topPlayer}
    />
  );
}
