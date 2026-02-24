import { Finding, AttackPathNode } from '../types';

export const mockAttackPath: AttackPathNode = {
  id: 'lambda-1',
  type: 'Lambda Function',
  name: 'aws-lambda-function\nProductOrderProcessor',
  children: [
    {
      id: 'role-1',
      type: 'IAM Role',
      name: 'arn:aws:iam::role\nPRODAdminGPAccessYHMR',
      children: [
        {
          id: 'policy-1',
          type: 'IAM Policy',
          name: 'arn:aws:iam::policy\nIdentityBasedPolicy',
          children: [
            { id: 'action-1', type: 'Action', name: 'sts:AssumeRole', children: [], traitCount: 2 },
            { id: 'action-2', type: 'Action', name: 'sts:GetSessionToken', children: [], traitCount: 1 }
          ],
          traitCount: 3
        }
      ],
      traitCount: 3
    },
    {
      id: 'gateway-1',
      type: 'API Gateway',
      name: 'arn:aws:apigateway\nOrdersAPI',
      children: [
        { id: 'endpoint-1', type: 'Endpoint', name: '/orders/submit', children: [], traitCount: 1 },
        { id: 'endpoint-2', type: 'Endpoint', name: '/orders/process', children: [], traitCount: 2 }
      ],
      traitCount: 3
    }
  ],
  category: 'primary'
};

const ap2: AttackPathNode = { id: 'ap2-lambda', type: 'Lambda Function', name: 'CustomerDataProcessor', children: [{ id: 'ap2-apigw', type: 'API Gateway', name: 'customer-api', children: [{ id: 'ap2-ep1', type: 'Endpoint', name: 'POST /customer/data', children: [], traitCount: 1 }, { id: 'ap2-ep2', type: 'Endpoint', name: 'GET /customer/profile', children: [], traitCount: 1 }], traitCount: 2 }, { id: 'ap2-role', type: 'IAM Role', name: 'CustomerDataRole', children: [{ id: 'ap2-pol', type: 'Policy', name: 'AdministratorAccess', children: [], traitCount: 3 }], traitCount: 2 }], category: 'primary' };

const ap3: AttackPathNode = { id: 'ap3-s3', type: 'S3 Bucket', name: 'customer-data-backup', children: [{ id: 'ap3-acl', type: 'ACL', name: 'PublicRead', children: [{ id: 'ap3-obj', type: 'Objects', name: 'customer-pii/*', children: [], traitCount: 2 }], traitCount: 1 }, { id: 'ap3-pol', type: 'Bucket Policy', name: 'Allow s3:GetObject *', children: [], traitCount: 1 }], category: 'primary' };

const ap4: AttackPathNode = { id: 'ap4-sg', type: 'Security Group', name: 'prod-web-server-sg', children: [{ id: 'ap4-rule', type: 'Inbound Rule', name: '0.0.0.0/0 → Port 22', children: [{ id: 'ap4-ec2a', type: 'EC2 Instance', name: 'prod-web-01', children: [], traitCount: 1 }, { id: 'ap4-ec2b', type: 'EC2 Instance', name: 'prod-web-02', children: [], traitCount: 1 }], traitCount: 2 }], category: 'primary' };

const ap5: AttackPathNode = { id: 'ap5-rds', type: 'RDS Instance', name: 'prod-customer-db', children: [{ id: 'ap5-pub', type: 'Public Endpoint', name: 'prod-customer-db.abc.us-east-1.rds.amazonaws.com', children: [{ id: 'ap5-cred', type: 'Credentials', name: 'Weak password', children: [], traitCount: 2 }], traitCount: 1 }, { id: 'ap5-sg', type: 'Security Group', name: 'sg-rds-open', children: [{ id: 'ap5-rule', type: 'Inbound', name: '0.0.0.0/0:3306', children: [], traitCount: 1 }], traitCount: 1 }], category: 'primary' };

const ap6: AttackPathNode = { id: 'ap6-ecs', type: 'ECS Task', name: 'prod-payment-service', children: [{ id: 'ap6-role', type: 'Task Role', name: 'PaymentServiceRole', children: [{ id: 'ap6-s3', type: 'S3 Access', name: 's3:*', children: [], traitCount: 2 }, { id: 'ap6-ddb', type: 'DynamoDB', name: 'dynamodb:*', children: [], traitCount: 1 }], traitCount: 3 }, { id: 'ap6-cross', type: 'Cross-Account', name: 'sts:AssumeRole → 295562301399', children: [], traitCount: 2 }], category: 'primary' };

const ap7: AttackPathNode = { id: 'ap7-cf', type: 'CloudFront', name: 'cdn-static-assets', children: [{ id: 'ap7-origin', type: 'S3 Origin', name: 'static-assets-bucket', children: [{ id: 'ap7-noenc', type: 'No Encryption', name: 'SSE disabled', children: [], traitCount: 1 }, { id: 'ap7-pub', type: 'Public Access', name: 'Bucket policy allows *', children: [], traitCount: 2 }], traitCount: 1 }], category: 'primary' };

const ap8: AttackPathNode = { id: 'ap8-iam', type: 'IAM User', name: 'svc-deploy-user', children: [{ id: 'ap8-key', type: 'Access Key', name: 'AKIA...XYZ (120 days old)', children: [], traitCount: 2 }, { id: 'ap8-console', type: 'Console Access', name: 'MFA: disabled', children: [{ id: 'ap8-pol', type: 'Attached Policy', name: 'DeployFullAccess', children: [], traitCount: 1 }], traitCount: 2 }], category: 'primary' };

const ap9: AttackPathNode = { id: 'ap9-ec2', type: 'EC2 Instance', name: 'prod-api-server-01', children: [{ id: 'ap9-ami', type: 'AMI', name: 'ami-0abc123 (120 days old)', children: [{ id: 'ap9-cve1', type: 'CVE', name: 'CVE-2024-1234 (kernel)', children: [], traitCount: 2 }, { id: 'ap9-cve2', type: 'CVE', name: 'CVE-2024-5678 (openssl)', children: [], traitCount: 1 }], traitCount: 3 }, { id: 'ap9-ip', type: 'Public IP', name: '54.23.45.67', children: [], traitCount: 1 }], category: 'primary' };

// Removed unused attack path nodes ap10 and ap11

const ap12: AttackPathNode = { id: 'ap12-es', type: 'OpenSearch Domain', name: 'prod-search-cluster', children: [{ id: 'ap12-ep', type: 'Public Endpoint', name: 'search-prod.us-east-1.es.amazonaws.com', children: [{ id: 'ap12-idx', type: 'Index', name: 'user-profiles (PII)', children: [], traitCount: 2 }, { id: 'ap12-idx2', type: 'Index', name: 'search-queries', children: [], traitCount: 1 }], traitCount: 1 }], category: 'primary' };

const ap13: AttackPathNode = { id: 'ap13-sns', type: 'SNS Topic', name: 'prod-alerts-topic', children: [{ id: 'ap13-pol', type: 'Topic Policy', name: 'Principal: *', children: [{ id: 'ap13-sub', type: 'Subscription', name: 'email-endpoint', children: [], traitCount: 1 }], traitCount: 2 }, { id: 'ap13-noenc', type: 'Encryption', name: 'SSE: disabled', children: [], traitCount: 1 }], category: 'primary' };

const ap14: AttackPathNode = { id: 'ap14-ebs', type: 'EBS Volume', name: 'vol-0a1b2c3d4e5f', children: [{ id: 'ap14-ec2', type: 'EC2 Instance', name: 'prod-api-server', children: [{ id: 'ap14-data', type: 'Data', name: '/var/lib/mysql/*', children: [], traitCount: 2 }], traitCount: 1 }, { id: 'ap14-snap', type: 'Snapshot', name: 'snap-unencrypted (shared)', children: [], traitCount: 2 }], category: 'primary' };

const ap15: AttackPathNode = { id: 'ap15-sqs', type: 'SQS Queue', name: 'prod-order-queue', children: [{ id: 'ap15-pol', type: 'Queue Policy', name: 'Principal: *', children: [{ id: 'ap15-send', type: 'Action', name: 'sqs:SendMessage', children: [], traitCount: 2 }, { id: 'ap15-recv', type: 'Action', name: 'sqs:ReceiveMessage', children: [], traitCount: 1 }], traitCount: 1 }, { id: 'ap15-noenc', type: 'Encryption', name: 'SSE: disabled', children: [], traitCount: 1 }], category: 'primary' };

export const mockFindings: Finding[] = [
  {
    id: 'finding-1',
    title: 'Potential Remote Execution: Lambda function accessible through API Gateway without authorization has code vulnerabilities',
    type: 'Threat',
    severity: 'Critical',
    status: 'New',
    count: 6,
    impact: 95,
    resource: 'ProductOrderProcessor',
    resourceType: 'AWS::Lambda::Function',
    account: '295562301397',
    region: 'us-east-1',
    age: '1 day',
    traits: [
      { id: 't1', name: 'Public Access', category: 'Reachability' },
      { id: 't2', name: 'No Authorization', category: 'Misconfiguration' },
      { id: 't3', name: 'Code Vulnerability', category: 'Vulnerability' }
    ],
    aiSummary: 'The Lambda function is accessible through an API Gateway without authorization and contains code vulnerabilities, exposing the function to remote code execution. Code vulnerabilities are security weaknesses in the Lambda function\'s source code that a threat actor could exploit to execute unauthorized code.',
    similarFindings: [
      { id: 'sf1', resource: 'OrderProcessor', account: '295562301397', region: 'us-east-1' },
      { id: 'sf2', resource: 'PaymentHandler', account: '295562301397', region: 'us-west-2' },
      { id: 'sf3', resource: 'UserAuthFunction', account: '295562301398', region: 'us-east-1' },
      { id: 'sf4', resource: 'DataSyncFunction', account: '295562301397', region: 'eu-west-1' },
      { id: 'sf5', resource: 'NotificationService', account: '295562301399', region: 'ap-southeast-1' },
      { id: 'sf6', resource: 'AnalyticsProcessor', account: '295562301397', region: 'us-east-1' }
    ],
    attackPath: mockAttackPath,
    remediationSteps: [
      'Review and update Lambda function dependencies to patch known vulnerabilities',
      'Use AWS Lambda Layers to manage shared dependencies and ensure consistent patching',
      'Enable AWS Lambda function URL authentication or implement API Gateway authorization'
    ]
  },
  {
    id: 'finding-2',
    title: 'Potential Remote Execution: Lambda function accessible through API Gateway without authorization has code vulnerabilities',
    type: 'Threat',
    severity: 'High',
    status: 'New',
    count: 6,
    impact: 90,
    resource: 'CustomerDataProcessor',
    resourceType: 'AWS::Lambda::Function',
    account: '295562301397',
    region: 'us-east-1',
    age: '1 day',
    traits: [
      { id: 't4', name: 'Internet Exposed', category: 'Reachability' },
      { id: 't5', name: 'Sensitive Data Access', category: 'Sensitive Data' },
      { id: 't6', name: 'Overly Permissive IAM', category: 'Misconfiguration' }
    ],
    aiSummary: 'This Lambda function processes customer data and is exposed to the internet through an API Gateway without proper authorization controls. The function has overly permissive IAM roles that could allow unauthorized access to sensitive customer information.',
    similarFindings: [
      { id: 'sf7', resource: 'DataAnalyzer', account: '295562301397', region: 'us-west-1' },
      { id: 'sf8', resource: 'ReportGenerator', account: '295562301399', region: 'eu-west-1' },
      { id: 'sf9', resource: 'CustomerProfileService', account: '295562301397', region: 'us-east-1' },
      { id: 'sf10', resource: 'BillingProcessor', account: '295562301398', region: 'us-west-2' },
      { id: 'sf11', resource: 'InventoryManager', account: '295562301397', region: 'ap-northeast-1' },
      { id: 'sf12', resource: 'OrderFulfillment', account: '295562301399', region: 'us-east-1' }
    ],
    attackPath: ap2,    remediationSteps: [
      'Implement API Gateway authorization using AWS IAM, Lambda authorizers, or Cognito',
      'Review and restrict IAM role permissions following least privilege principle',
      'Enable AWS CloudTrail logging for Lambda function invocations'
    ]
  },
  {
    id: 'finding-3',
    title: 'S3 Bucket with public read access contains sensitive data',
    type: 'Threat',
    severity: 'Medium',
    status: 'In Progress',
    count: 3,
    impact: 60,
    resource: 'customer-data-backup',
    resourceType: 'AWS::S3::Bucket',
    account: '295562301397',
    region: 'us-east-1',
    age: '3 days',
    traits: [
      { id: 't7', name: 'Public Read Access', category: 'Misconfiguration' },
      { id: 't8', name: 'Contains PII', category: 'Sensitive Data' }
    ],
    aiSummary: 'An S3 bucket containing customer backup data has been configured with public read access, potentially exposing personally identifiable information (PII) to unauthorized parties.',
    similarFindings: [
      { id: 'sf13', resource: 'logs-archive', account: '295562301397', region: 'us-west-2' },
      { id: 'sf14', resource: 'backup-storage', account: '295562301398', region: 'us-east-1' },
      { id: 'sf15', resource: 'temp-uploads', account: '295562301397', region: 'eu-central-1' }
    ],
    attackPath: ap3,    remediationSteps: [
      'Remove public access permissions from the S3 bucket',
      'Enable S3 Block Public Access at the account level',
      'Implement bucket policies that restrict access to authorized principals only'
    ]
  },
  {
    id: 'finding-4',
    title: 'Unrestricted SSH access to EC2 instances via security group misconfiguration',
    type: 'Threat',
    severity: 'Critical',
    status: 'New',
    count: 4,
    impact: 85,
    resource: 'prod-web-server-sg',
    resourceType: 'AWS::EC2::SecurityGroup',
    account: '295562301398',
    region: 'us-west-2',
    age: '2 days',
    traits: [
      { id: 't9', name: 'Open SSH Port', category: 'Misconfiguration' },
      { id: 't10', name: 'Public Subnet', category: 'Reachability' }
    ],
    aiSummary: 'A security group attached to production EC2 instances allows unrestricted SSH access (port 22) from 0.0.0.0/0. This exposes the instances to brute-force attacks and unauthorized remote access from any IP address on the internet.',
    similarFindings: [
      { id: 'sf16', resource: 'staging-web-sg', account: '295562301398', region: 'us-west-2' },
      { id: 'sf17', resource: 'api-server-sg', account: '295562301397', region: 'us-east-1' },
      { id: 'sf18', resource: 'batch-worker-sg', account: '295562301399', region: 'eu-west-1' },
      { id: 'sf19', resource: 'monitoring-sg', account: '295562301397', region: 'us-west-2' }
    ],
    attackPath: ap4,
    remediationSteps: [
      'Restrict SSH access to specific trusted IP ranges or use AWS Systems Manager Session Manager',
      'Remove 0.0.0.0/0 inbound rules on port 22 from the security group',
      'Implement VPN or bastion host architecture for remote access'
    ]
  },
  {
    id: 'finding-5',
    title: 'RDS instance publicly accessible with weak authentication credentials',
    type: 'Threat',
    severity: 'High',
    status: 'New',
    count: 5,
    impact: 88,
    resource: 'prod-customer-db',
    resourceType: 'AWS::RDS::DBInstance',
    account: '295562301397',
    region: 'us-east-1',
    age: '1 day',
    traits: [
      { id: 't11', name: 'Publicly Accessible', category: 'Reachability' },
      { id: 't12', name: 'Weak Credentials', category: 'Vulnerability' },
      { id: 't13', name: 'Contains PII', category: 'Sensitive Data' }
    ],
    aiSummary: 'A production RDS instance storing customer data is publicly accessible and uses weak authentication credentials. This combination creates a high risk of unauthorized database access and potential data exfiltration.',
    similarFindings: [
      { id: 'sf20', resource: 'analytics-db', account: '295562301397', region: 'us-east-1' },
      { id: 'sf21', resource: 'reporting-db', account: '295562301398', region: 'us-west-2' },
      { id: 'sf22', resource: 'staging-db', account: '295562301397', region: 'eu-west-1' },
      { id: 'sf23', resource: 'audit-log-db', account: '295562301399', region: 'us-east-1' },
      { id: 'sf24', resource: 'session-store-db', account: '295562301397', region: 'ap-southeast-1' }
    ],
    attackPath: ap5,    remediationSteps: [
      'Disable public accessibility on the RDS instance immediately',
      'Rotate database credentials and enforce strong password policies',
      'Move the RDS instance to a private subnet with VPC security groups'
    ]
  },
  {
    id: 'finding-6',
    title: 'ECS task role with overly permissive S3 and DynamoDB access in production',
    type: 'Threat',
    severity: 'Low',
    status: 'New',
    count: 4,
    impact: 82,
    resource: 'prod-payment-service',
    resourceType: 'ECS Task',
    account: '295562301398',
    region: 'us-east-1',
    age: '2 days',
    traits: [
      { id: 't14', name: 'Overly Permissive Role', category: 'Misconfiguration' },
      { id: 't15', name: 'Cross-Account Access', category: 'Assumability' }
    ],
    aiSummary: 'An ECS task running the payment service has an IAM role with wildcard permissions on S3 and DynamoDB. The role also allows cross-account assume-role, creating a lateral movement risk if the container is compromised.',
    similarFindings: [
      { id: 'sf25', resource: 'order-service', account: '295562301398', region: 'us-east-1' },
      { id: 'sf26', resource: 'notification-service', account: '295562301397', region: 'us-west-2' },
      { id: 'sf27', resource: 'inventory-service', account: '295562301398', region: 'eu-west-1' },
      { id: 'sf28', resource: 'auth-service', account: '295562301399', region: 'us-east-1' }
    ],
    attackPath: ap6,    remediationSteps: [
      'Replace wildcard IAM permissions with resource-specific policies',
      'Remove cross-account assume-role permissions unless explicitly required',
      'Implement IAM Access Analyzer to identify unused permissions'
    ]
  },
  {
    id: 'finding-7',
    title: 'CloudFront distribution serving content from unencrypted S3 origin',
    type: 'Exposure',
    severity: 'High',
    status: 'New',
    count: 3,
    impact: 75,
    resource: 'cdn-static-assets',
    resourceType: 'CloudFront Distribution',
    account: '295562301397',
    region: 'us-east-1',
    age: '1 day',
    traits: [
      { id: 't16', name: 'No Encryption', category: 'Misconfiguration' },
      { id: 't17', name: 'Public Origin', category: 'Reachability' }
    ],
    aiSummary: 'A CloudFront distribution is configured to serve content from an S3 bucket without server-side encryption. The S3 origin bucket is also publicly accessible, bypassing CloudFront access controls entirely.',
    similarFindings: [
      { id: 'sf29', resource: 'cdn-media-assets', account: '295562301397', region: 'us-east-1' },
      { id: 'sf30', resource: 'cdn-user-uploads', account: '295562301398', region: 'us-east-1' },
      { id: 'sf31', resource: 'cdn-docs', account: '295562301397', region: 'us-east-1' }
    ],
    attackPath: ap7,    remediationSteps: [
      'Enable server-side encryption (SSE-S3 or SSE-KMS) on the S3 origin bucket',
      'Configure Origin Access Control (OAC) to restrict direct S3 access',
      'Enable CloudFront field-level encryption for sensitive data'
    ]
  },
  {
    id: 'finding-8',
    title: 'IAM user with long-lived access keys and console access without MFA',
    type: 'Exposure',
    severity: 'Medium',
    status: 'New',
    count: 3,
    impact: 65,
    resource: 'svc-deploy-user',
    resourceType: 'IAM User',
    account: '295562301397',
    region: 'us-east-1',
    age: '5 days',
    traits: [
      { id: 't18', name: 'No MFA', category: 'Misconfiguration' },
      { id: 't19', name: 'Stale Access Keys', category: 'Vulnerability' }
    ],
    aiSummary: 'An IAM user has active access keys that have not been rotated in over 90 days and has console access enabled without multi-factor authentication. This creates a credential compromise risk.',
    similarFindings: [
      { id: 'sf32', resource: 'svc-monitoring-user', account: '295562301397', region: 'us-east-1' },
      { id: 'sf33', resource: 'svc-backup-user', account: '295562301398', region: 'us-west-2' },
      { id: 'sf34', resource: 'svc-ci-user', account: '295562301397', region: 'eu-west-1' }
    ],
    attackPath: ap8,
    remediationSteps: [
      'Enable MFA for all IAM users with console access',
      'Rotate access keys and enforce a 90-day rotation policy',
      'Migrate to IAM roles with temporary credentials where possible'
    ]
  },
  {
    id: 'finding-9',
    title: 'EC2 instance running outdated AMI with known kernel vulnerabilities',
    type: 'Exposure',
    severity: 'Low',
    status: 'In Progress',
    count: 5,
    impact: 70,
    resource: 'prod-api-server-01',
    resourceType: 'EC2 Instance',
    account: '295562301398',
    region: 'us-west-2',
    age: '7 days',
    traits: [
      { id: 't20', name: 'Outdated AMI', category: 'Vulnerability' },
      { id: 't21', name: 'Public IP', category: 'Reachability' }
    ],
    aiSummary: 'Production EC2 instances are running an AMI that is over 120 days old with multiple known kernel-level CVEs. The instances have public IP addresses, increasing the attack surface for exploitation.',
    similarFindings: [
      { id: 'sf35', resource: 'prod-api-server-02', account: '295562301398', region: 'us-west-2' },
      { id: 'sf36', resource: 'prod-worker-01', account: '295562301397', region: 'us-east-1' },
      { id: 'sf37', resource: 'prod-worker-02', account: '295562301397', region: 'us-east-1' },
      { id: 'sf38', resource: 'staging-api-server', account: '295562301398', region: 'us-west-2' },
      { id: 'sf39', resource: 'dev-api-server', account: '295562301399', region: 'eu-west-1' }
    ],
    attackPath: ap9,
    remediationSteps: [
      'Update instances to the latest approved AMI with patched kernel',
      'Implement automated AMI patching pipeline using EC2 Image Builder',
      'Remove public IP addresses and route traffic through a load balancer'
    ]
  },

  {
    id: 'finding-12',
    title: 'Elasticsearch domain publicly accessible without VPC or fine-grained access control',
    type: 'Exposure',
    severity: 'High',
    status: 'New',
    count: 3,
    impact: 68,
    resource: 'prod-search-cluster',
    resourceType: 'OpenSearch Domain',
    account: '295562301397',
    region: 'us-east-1',
    age: '4 days',
    traits: [
      { id: 't26', name: 'Public Endpoint', category: 'Reachability' },
      { id: 't27', name: 'No VPC', category: 'Misconfiguration' },
      { id: 't28', name: 'Contains User Data', category: 'Sensitive Data' }
    ],
    aiSummary: 'A production OpenSearch domain is deployed with a public endpoint outside of a VPC and lacks fine-grained access control. The domain indexes user search queries and profile data that could be accessed by unauthorized parties.',
    similarFindings: [
      { id: 'sf46', resource: 'analytics-search', account: '295562301398', region: 'us-west-2' },
      { id: 'sf47', resource: 'log-search', account: '295562301397', region: 'eu-west-1' },
      { id: 'sf48', resource: 'product-search', account: '295562301397', region: 'us-east-1' }
    ],
    attackPath: ap12,    remediationSteps: [
      'Deploy the OpenSearch domain within a VPC with private subnets',
      'Enable fine-grained access control with IAM-based authentication',
      'Restrict access policies to specific IAM roles and IP ranges'
    ]
  },
  {
    id: 'finding-13',
    title: 'SNS topic with cross-account publish permissions and no encryption',
    type: 'Exposure',
    severity: 'High',
    status: 'In Progress',
    count: 4,
    impact: 58,
    resource: 'prod-alerts-topic',
    resourceType: 'SNS Topic',
    account: '295562301398',
    region: 'us-west-2',
    age: '6 days',
    traits: [
      { id: 't29', name: 'Cross-Account Access', category: 'Assumability' },
      { id: 't30', name: 'No Encryption', category: 'Misconfiguration' }
    ],
    aiSummary: 'An SNS topic used for production alerts allows publish access from any AWS account (*) and does not have server-side encryption enabled. Malicious actors could inject false alerts or intercept notification payloads.',
    similarFindings: [
      { id: 'sf49', resource: 'billing-notifications', account: '295562301398', region: 'us-west-2' },
      { id: 'sf50', resource: 'deployment-notifications', account: '295562301397', region: 'us-east-1' },
      { id: 'sf51', resource: 'error-notifications', account: '295562301399', region: 'eu-west-1' },
      { id: 'sf52', resource: 'security-alerts', account: '295562301397', region: 'us-east-1' }
    ],
    attackPath: ap13,    remediationSteps: [
      'Restrict SNS topic policy to specific trusted AWS account IDs',
      'Enable server-side encryption using AWS KMS',
      'Audit and remove wildcard principal permissions from the topic policy'
    ]
  },
  {
    id: 'finding-14',
    title: 'EBS volumes unencrypted containing application data in production',
    type: 'Exposure',
    severity: 'High',
    status: 'New',
    count: 5,
    impact: 72,
    resource: 'vol-0a1b2c3d4e5f',
    resourceType: 'EBS Volume',
    account: '295562301397',
    region: 'us-east-1',
    age: '2 days',
    traits: [
      { id: 't31', name: 'No Encryption', category: 'Misconfiguration' },
      { id: 't32', name: 'Contains App Data', category: 'Sensitive Data' }
    ],
    aiSummary: 'Multiple production EBS volumes storing application data and database files are not encrypted. Snapshots of these volumes could expose sensitive data if shared or if the underlying hardware is decommissioned.',
    similarFindings: [
      { id: 'sf53', resource: 'vol-1b2c3d4e5f6g', account: '295562301397', region: 'us-east-1' },
      { id: 'sf54', resource: 'vol-2c3d4e5f6g7h', account: '295562301398', region: 'us-west-2' },
      { id: 'sf55', resource: 'vol-3d4e5f6g7h8i', account: '295562301397', region: 'eu-west-1' },
      { id: 'sf56', resource: 'vol-4e5f6g7h8i9j', account: '295562301399', region: 'us-east-1' },
      { id: 'sf57', resource: 'vol-5f6g7h8i9j0k', account: '295562301397', region: 'ap-southeast-1' }
    ],
    attackPath: ap14,    remediationSteps: [
      'Enable default EBS encryption at the account level for all new volumes',
      'Create encrypted copies of existing unencrypted volumes and migrate data',
      'Enforce encryption via SCP policies across the organization'
    ]
  },
  {
    id: 'finding-15',
    title: 'SQS queue with wildcard access policy allowing any principal to send messages',
    type: 'Exposure',
    severity: 'High',
    status: 'New',
    count: 3,
    impact: 50,
    resource: 'prod-order-queue',
    resourceType: 'SQS Queue',
    account: '295562301397',
    region: 'us-east-1',
    age: '3 days',
    traits: [
      { id: 't33', name: 'Wildcard Principal', category: 'Misconfiguration' },
      { id: 't34', name: 'No Encryption', category: 'Misconfiguration' }
    ],
    aiSummary: 'A production SQS queue processing customer orders has a resource policy with a wildcard principal (*), allowing any AWS account to send messages. The queue also lacks server-side encryption.',
    similarFindings: [
      { id: 'sf58', resource: 'prod-payment-queue', account: '295562301397', region: 'us-east-1' },
      { id: 'sf59', resource: 'prod-notification-queue', account: '295562301398', region: 'us-west-2' },
      { id: 'sf60', resource: 'prod-audit-queue', account: '295562301399', region: 'eu-west-1' }
    ],
    attackPath: ap15,    remediationSteps: [
      'Replace wildcard principal with specific AWS account IDs and IAM roles',
      'Enable server-side encryption using SQS-managed keys or AWS KMS',
      'Add condition keys to restrict access by source VPC or IP range'
    ]
  }
];

export const dashboardStats = {
  exposures: { total: 20, change: -2, critical: 18, high: 15, medium: 9, low: 1 },
  totalFindings: { total: 2500, change: -2 },
  threats: { total: 6, change: -2, critical: 2, high: 2, medium: 1, low: 1 },
  vulnerabilities: { total: 200, change: -2, critical: 20, high: 60, medium: 100, low: 20 },
  posture: { total: 560, change: -2, critical: 10, high: 90, medium: 290, low: 170 },
  sensitiveData: { total: 85, change: -3, critical: 5, high: 20, medium: 35, low: 25 }
};
