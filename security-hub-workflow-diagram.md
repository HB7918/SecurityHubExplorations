# AWS Security Hub Workflow - Block Diagram

```mermaid
graph TB
    subgraph Setup["1. Getting Started & Setup"]
        S1[Enable Security Hub for<br/>organizational accounts with<br/>delegated administrator]
        S2[Navigate to individual security<br/>service dashboards<br/>Inspector, Macie, CSPM]
        S3[Configure coverage across<br/>member accounts and regions]
        S1 --> S2 --> S3
    end

    subgraph Discovery["2. Discovery & Visibility"]
        D1[View Security Hub dashboard<br/>for coverage status]
        D2[Review exposure findings<br/>and threat findings]
        D3[Check resource inventory<br/>for deployed AWS assets]
        D1 --> D2 --> D3
    end

    subgraph Triage["3. Triage & Investigation"]
        T1[Filter findings using<br/>filter-based search]
        T2[Click into individual exposures<br/>to view traits and signals]
        T3[Navigate to attack path<br/>visualization]
        T4[Switch between Security Hub<br/>and service consoles<br/>Inspector, EC2, S3]
        T1 --> T2 --> T3 --> T4
    end

    subgraph Remediation["4. Remediation"]
        R1[Click hyperlinks to<br/>AWS documentation]
        R2[Manually interpret generic<br/>documentation and determine steps]
        R3[Navigate across multiple<br/>AWS service consoles and accounts]
        R4[Validate issue resolution<br/>in Security Hub]
        R1 --> R2 --> R3 --> R4
    end

    subgraph Tracking["5. Tracking & Reporting"]
        TR1[Export findings to external<br/>ticketing systems<br/>Jira, ServiceNow, spreadsheets]
        TR2[Manually track assignments,<br/>due dates, and SLAs]
        TR3[Review finding count trends<br/>limited drill-down]
        TR4[Manually determine resolution<br/>reasons and dates]
        TR1 --> TR2 --> TR3 --> TR4
    end

    Setup --> Discovery
    Discovery --> Triage
    Triage --> Remediation
    Remediation --> Tracking
    Tracking -.->|Continuous Monitoring| Discovery

    style Setup fill:#e1f5ff
    style Discovery fill:#fff4e1
    style Triage fill:#ffe1f5
    style Remediation fill:#e1ffe1
    style Tracking fill:#f5e1ff
```

## Workflow Stages

### 1. Getting Started & Setup
Initial configuration of Security Hub and related security services across the organization.

### 2. Discovery & Visibility
Ongoing monitoring and visibility into security posture, findings, and resource inventory.

### 3. Triage & Investigation
Deep dive into specific findings to understand context, relationships, and impact.

### 4. Remediation
Process of fixing identified security issues through manual interpretation and implementation.

### 5. Tracking & Reporting
Managing the lifecycle of findings, tracking progress, and reporting on security posture.

## Key Observations

- **Manual Steps**: Many steps require manual navigation between consoles and interpretation of documentation
- **Continuous Loop**: The workflow cycles back from tracking to discovery for ongoing monitoring
- **Multi-Console Navigation**: Users frequently switch between Security Hub and individual service consoles
- **External Integration**: Tracking often requires external tools like Jira or ServiceNow
