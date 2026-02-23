# Comments Feature Setup Guide

The comments feature has been added to your Security Hub project. Follow these steps to complete the setup.

## What's Been Added

- ✅ AWS Amplify dependencies installed
- ✅ GraphQL queries, mutations, and subscriptions created
- ✅ CommentsPanel component created
- ✅ Comments added to Threats page
- ✅ Amplify configured in main.tsx

## Next Steps: AWS AppSync Setup

### 1. Create AppSync API

1. Go to [AWS Console → AppSync](https://console.aws.amazon.com/appsync)
2. Click "Create API"
3. Choose "Build from scratch"
4. Name it: `security-hub-comments-api`
5. Click "Create"

### 2. Define Schema

In AppSync Console → Schema, paste the following schema:

\`\`\`graphql
type Comment {
  screenname: String!
  timestamp: AWSDateTime!
  text: String!
  author: String!
  pinX: Float
  pinY: Float
}

type CommentConnection {
  items: [Comment]
  nextToken: String
}

input CreateCommentInput {
  screenname: String!
  text: String!
  author: String!
  timestamp: AWSDateTime!
  pinX: Float
  pinY: Float
}

input DeleteCommentInput {
  screenname: String!
  timestamp: AWSDateTime!
}

input UpdateCommentInput {
  screenname: String!
  timestamp: AWSDateTime!
  text: String
  author: String
  pinX: Float
  pinY: Float
}

input TableCommentFilterInput {
  screenname: TableStringFilterInput
  timestamp: TableStringFilterInput
  text: TableStringFilterInput
  author: TableStringFilterInput
}

input TableStringFilterInput {
  ne: String
  eq: String
  le: String
  lt: String
  ge: String
  gt: String
  contains: String
  notContains: String
  between: [String]
  beginsWith: String
}

type Query {
  getComment(screenname: String!, timestamp: AWSDateTime!): Comment
  listComments(filter: TableCommentFilterInput, limit: Int, nextToken: String): CommentConnection
}

type Mutation {
  createComment(input: CreateCommentInput!): Comment
  updateComment(input: UpdateCommentInput!): Comment
  deleteComment(input: DeleteCommentInput!): Comment
}

type Subscription {
  onCreateComment(screenname: String, text: String, author: String, timestamp: AWSDateTime): Comment
    @aws_subscribe(mutations: ["createComment"])
  onUpdateComment(screenname: String, text: String, author: String, timestamp: AWSDateTime): Comment
    @aws_subscribe(mutations: ["updateComment"])
  onDeleteComment(screenname: String, text: String, author: String, timestamp: AWSDateTime): Comment
    @aws_subscribe(mutations: ["deleteComment"])
}
\`\`\`

Click "Save Schema"

### 3. Create DynamoDB Data Source

1. Go to Data Sources → Create data source
2. Name: `CommentsTable`
3. Type: Amazon DynamoDB
4. Create new table:
   - Table name: `security-hub-comments`
   - Primary key: `screenname` (String)
   - Sort key: `timestamp` (String)
5. Click "Create"

### 4. Attach Resolvers

For each Query/Mutation, attach resolvers to the DynamoDB data source:

#### listComments Resolver

**Request mapping:**
\`\`\`velocity
{
  "version": "2017-02-28",
  "operation": "Scan",
  #if($ctx.args.filter)
    "filter": $util.transform.toDynamoDBFilterExpression($ctx.args.filter)
  #end
  #if($ctx.args.limit)
    ,"limit": $ctx.args.limit
  #end
  #if($ctx.args.nextToken)
    ,"nextToken": "$ctx.args.nextToken"
  #end
}
\`\`\`

**Response mapping:**
\`\`\`velocity
$util.toJson($ctx.result)
\`\`\`

#### createComment Resolver

**Request mapping:**
\`\`\`velocity
{
  "version": "2017-02-28",
  "operation": "PutItem",
  "key": {
    "screenname": $util.dynamodb.toDynamoDBJson($ctx.args.input.screenname),
    "timestamp": $util.dynamodb.toDynamoDBJson($ctx.args.input.timestamp)
  },
  "attributeValues": {
    "text": $util.dynamodb.toDynamoDBJson($ctx.args.input.text),
    "author": $util.dynamodb.toDynamoDBJson($ctx.args.input.author),
    "pinX": $util.dynamodb.toDynamoDBJson($ctx.args.input.pinX),
    "pinY": $util.dynamodb.toDynamoDBJson($ctx.args.input.pinY)
  }
}
\`\`\`

**Response mapping:**
\`\`\`velocity
$util.toJson($ctx.result)
\`\`\`

#### deleteComment Resolver

**Request mapping:**
\`\`\`velocity
{
  "version": "2017-02-28",
  "operation": "DeleteItem",
  "key": {
    "screenname": $util.dynamodb.toDynamoDBJson($ctx.args.input.screenname),
    "timestamp": $util.dynamodb.toDynamoDBJson($ctx.args.input.timestamp)
  }
}
\`\`\`

**Response mapping:**
\`\`\`velocity
$util.toJson($ctx.result)
\`\`\`

### 5. Configure API Key Authentication

1. Go to Settings → Default authorization mode
2. Select "API Key"
3. Create or note your API key (it will expire in 7 days by default)

### 6. Update Your Configuration

1. From AppSync Console, note:
   - GraphQL endpoint URL
   - API Key
   - Region

2. Update `src/aws-exports.ts`:

\`\`\`typescript
const awsconfig = {
  API: {
    GraphQL: {
      endpoint: 'YOUR_APPSYNC_ENDPOINT_HERE',
      region: 'us-east-1', // or your region
      defaultAuthMode: 'apiKey' as const,
      apiKey: 'YOUR_API_KEY_HERE'
    }
  }
};

export default awsconfig;
\`\`\`

## How to Use

1. Navigate to the Threats page
2. Click the "📍 Add comment" button in the bottom right
3. Click anywhere on the screen to place a pin
4. Type your comment and press Enter
5. Hover over pins to preview comments
6. Click pins to expand and view full details
7. Use "👁️ Hide/View comments" to toggle pin visibility

## Adding Comments to Other Pages

To add comments to other pages, import and add the CommentsPanel component:

\`\`\`tsx
import CommentsPanel from './components/CommentsPanel';

function MyPage() {
  return (
    <div>
      {/* Your page content */}
      <CommentsPanel screenName="My Page Name" />
    </div>
  );
}
\`\`\`

Use unique `screenName` values for each page to keep comments separate.

## Features

- 📍 Click anywhere to drop a comment pin
- 💬 Inline comment input at pin location
- 👁️ Toggle pin visibility
- 🔄 Real-time sync across users (when AppSync is configured)
- 💾 Local storage fallback when offline

## Troubleshooting

### Comments not loading
- Check browser console for errors
- Verify AppSync endpoint and API key in `src/aws-exports.ts`
- Ensure DynamoDB table exists with correct schema

### Real-time updates not working
- Verify subscriptions are enabled in AppSync
- Check WebSocket connection in browser Network tab

### Build fails
- Ensure `src/aws-exports.ts` is in `.gitignore`
- For production, use environment variables instead of hardcoded values

## Security Notes

⚠️ **Important**: API keys are suitable for prototypes but not production.

For production:
- Use AWS Cognito authentication instead of API keys
- Never commit `aws-exports.ts` with real credentials to public repos
- Use environment variables for deployed applications
