// Analysis data utilities for parsing and processing analyzed files

export interface AnalysisMetrics {
  totalFindings: number;
  criticalIssues: number;
  mediumRiskIssues: number;
  lowRiskIssues: number;
  securityScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface KeyFinding {
  title: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
  recommendation?: string;
}

export interface AnalysisChartData {
  vulnerabilityTypes: { name: string; value: number; }[];
  severityDistribution: { severity: string; count: number; }[];
  timelineData: { time: string; issues: number; }[];
  complianceData: { category: string; score: number; }[];
}

export interface ParsedAnalysisData {
  fileName: string;
  filePath: string;
  analysisDate: Date;
  metrics: AnalysisMetrics;
  keyFindings: KeyFinding[];
  chartData: AnalysisChartData;
  rawContent: string;
  summary: string;
}

// Parse RPM packages analysis
const parseRpmAnalysis = (content: string, fileName: string, filePath: string): ParsedAnalysisData => {
  const lines = content.split('\n');
  const criticalVulns = (content.match(/CRITICAL VULNERABILITIES:/g) || []).length;
  const mediumRisk = (content.match(/MEDIUM RISK/g) || []).length;
  
  const keyFindings: KeyFinding[] = [
    {
      title: "Critical OpenSSL Vulnerability",
      severity: 'CRITICAL',
      description: "CVE-2019-1547: ECDSA remote timing attack vulnerability in OpenSSL",
      recommendation: "Update to latest version immediately"
    },
    {
      title: "Sudo Privilege Escalation",
      severity: 'CRITICAL',
      description: "CVE-2019-14287: Privilege escalation vulnerability in sudo",
      recommendation: "Immediate update required"
    },
    {
      title: "Kernel Security Issues",
      severity: 'HIGH',
      description: "Multiple kernel vulnerabilities detected",
      recommendation: "System reboot required after update"
    }
  ];

  return {
    fileName,
    filePath,
    analysisDate: new Date(),
    metrics: {
      totalFindings: 1247,
      criticalIssues: 3,
      mediumRiskIssues: 12,
      lowRiskIssues: 28,
      securityScore: 25, // Lower is worse for security
      riskLevel: 'CRITICAL'
    },
    keyFindings,
    chartData: {
      vulnerabilityTypes: [
        { name: 'Privilege Escalation', value: 2 },
        { name: 'Remote Code Execution', value: 1 },
        { name: 'Information Disclosure', value: 8 },
        { name: 'DoS Vulnerability', value: 4 }
      ],
      severityDistribution: [
        { severity: 'Critical', count: 3 },
        { severity: 'High', count: 8 },
        { severity: 'Medium', count: 12 },
        { severity: 'Low', count: 28 }
      ],
      timelineData: [
        { time: '00:00', issues: 0 },
        { time: '00:15', issues: 5 },
        { time: '00:30', issues: 15 },
        { time: '00:45', issues: 28 },
        { time: '01:00', issues: 43 }
      ],
      complianceData: [
        { category: 'Patch Management', score: 30 },
        { category: 'Security Updates', score: 25 },
        { category: 'Vulnerability Management', score: 40 },
        { category: 'System Hardening', score: 35 }
      ]
    },
    rawContent: content,
    summary: "Critical security vulnerabilities detected in RPM packages including privilege escalation and remote timing attacks."
  };
};

// Parse security key analysis
const parseSecurityKeyAnalysis = (content: string, fileName: string, filePath: string): ParsedAnalysisData => {
  const keyFindings: KeyFinding[] = [
    {
      title: "Suspicious Geographic Access",
      severity: 'CRITICAL',
      description: "Security key accessed from suspicious locations (Moscow, Beijing)",
      recommendation: "Immediate key revocation and regeneration required"
    },
    {
      title: "Unusual Access Patterns",
      severity: 'HIGH',
      description: "Access attempts detected outside normal business hours",
      recommendation: "Implement time-based access controls"
    },
    {
      title: "Multiple Failed Attempts",
      severity: 'MEDIUM',
      description: "Repeated unsuccessful authentication attempts detected",
      recommendation: "Monitor for brute force attacks"
    }
  ];

  return {
    fileName,
    filePath,
    analysisDate: new Date(),
    metrics: {
      totalFindings: 15,
      criticalIssues: 1,
      mediumRiskIssues: 2,
      lowRiskIssues: 12,
      securityScore: 15,
      riskLevel: 'CRITICAL'
    },
    keyFindings,
    chartData: {
      vulnerabilityTypes: [
        { name: 'Unauthorized Access', value: 8 },
        { name: 'Geographic Anomaly', value: 3 },
        { name: 'Time-based Anomaly', value: 2 },
        { name: 'Failed Authentication', value: 2 }
      ],
      severityDistribution: [
        { severity: 'Critical', count: 1 },
        { severity: 'High', count: 2 },
        { severity: 'Medium', count: 2 },
        { severity: 'Low', count: 10 }
      ],
      timelineData: [
        { time: '00:00', issues: 0 },
        { time: '02:00', issues: 8 },
        { time: '04:00', issues: 12 },
        { time: '06:00', issues: 15 },
        { time: '08:00', issues: 15 }
      ],
      complianceData: [
        { category: 'Access Control', score: 20 },
        { category: 'Geographic Security', score: 15 },
        { category: 'Time-based Controls', score: 25 },
        { category: 'Key Management', score: 30 }
      ]
    },
    rawContent: content,
    summary: "Critical security key compromise detected with suspicious geographic and temporal access patterns."
  };
};

// Parse vulnerability inputs analysis
const parseVulnInputsAnalysis = (content: string, fileName: string, filePath: string): ParsedAnalysisData => {
  const keyFindings: KeyFinding[] = [
    {
      title: "SQL Injection Vulnerability",
      severity: 'CRITICAL',
      description: "Successful SQL injection attack on login form",
      recommendation: "Implement parameterized queries immediately"
    },
    {
      title: "Cross-Site Scripting (XSS)",
      severity: 'HIGH',
      description: "XSS vulnerability in comment section allows script execution",
      recommendation: "Add proper output encoding and input validation"
    },
    {
      title: "Command Injection",
      severity: 'CRITICAL',
      description: "Command injection in file upload allows system file access",
      recommendation: "Strengthen file upload security and input validation"
    }
  ];

  return {
    fileName,
    filePath,
    analysisDate: new Date(),
    metrics: {
      totalFindings: 106,
      criticalIssues: 2,
      mediumRiskIssues: 8,
      lowRiskIssues: 96,
      securityScore: 20,
      riskLevel: 'CRITICAL'
    },
    keyFindings,
    chartData: {
      vulnerabilityTypes: [
        { name: 'SQL Injection', value: 45 },
        { name: 'XSS', value: 23 },
        { name: 'Command Injection', value: 18 },
        { name: 'Buffer Overflow', value: 12 },
        { name: 'Path Traversal', value: 8 }
      ],
      severityDistribution: [
        { severity: 'Critical', count: 2 },
        { severity: 'High', count: 8 },
        { severity: 'Medium', count: 20 },
        { severity: 'Low', count: 76 }
      ],
      timelineData: [
        { time: '10:00', issues: 0 },
        { time: '10:15', issues: 25 },
        { time: '10:30', issues: 60 },
        { time: '10:45', issues: 85 },
        { time: '11:00', issues: 106 }
      ],
      complianceData: [
        { category: 'Input Validation', score: 15 },
        { category: 'Output Encoding', score: 25 },
        { category: 'Database Security', score: 20 },
        { category: 'File Security', score: 30 }
      ]
    },
    rawContent: content,
    summary: "Multiple critical vulnerabilities including SQL injection and command injection requiring immediate remediation."
  };
};

// Parse WiFi passwords analysis
const parseWifiAnalysis = (content: string, fileName: string, filePath: string): ParsedAnalysisData => {
  const keyFindings: KeyFinding[] = [
    {
      title: "Extremely Weak Passwords",
      severity: 'CRITICAL',
      description: "Multiple networks using dictionary passwords like 'password123'",
      recommendation: "Implement strong password policy immediately"
    },
    {
      title: "Default Credentials",
      severity: 'HIGH',
      description: "Guest network using default 'guest' password",
      recommendation: "Change all default passwords and disable guest network if unused"
    },
    {
      title: "WPS Vulnerabilities",
      severity: 'MEDIUM',
      description: "WPS functionality enabled on multiple networks",
      recommendation: "Disable WPS on all wireless networks"
    }
  ];

  return {
    fileName,
    filePath,
    analysisDate: new Date(),
    metrics: {
      totalFindings: 15,
      criticalIssues: 8,
      mediumRiskIssues: 4,
      lowRiskIssues: 3,
      securityScore: 10,
      riskLevel: 'CRITICAL'
    },
    keyFindings,
    chartData: {
      vulnerabilityTypes: [
        { name: 'Weak Passwords', value: 8 },
        { name: 'Default Credentials', value: 3 },
        { name: 'WPS Enabled', value: 2 },
        { name: 'Encryption Issues', value: 2 }
      ],
      severityDistribution: [
        { severity: 'Critical', count: 8 },
        { severity: 'High', count: 4 },
        { severity: 'Medium', count: 2 },
        { severity: 'Low', count: 1 }
      ],
      timelineData: [
        { time: '09:00', issues: 0 },
        { time: '09:15', issues: 4 },
        { time: '09:30', issues: 8 },
        { time: '09:45', issues: 12 },
        { time: '10:00', issues: 15 }
      ],
      complianceData: [
        { category: 'Password Security', score: 5 },
        { category: 'Encryption Standards', score: 15 },
        { category: 'Network Isolation', score: 20 },
        { category: 'Access Control', score: 10 }
      ]
    },
    rawContent: content,
    summary: "Critical wireless security vulnerabilities with extremely weak passwords and default credentials."
  };
};

// Main parsing function that routes to specific parsers
export const parseAnalysisFile = async (filePath: string, fileName: string): Promise<ParsedAnalysisData | null> => {
  try {
    // In a real implementation, this would fetch the actual file content
    // For demo, we'll use the mock content from fileUtils
    const { readTextFileContent } = await import('./fileUtils');
    const content = await readTextFileContent(filePath);

    if (filePath.includes('rpm-packages-backup')) {
      return parseRpmAnalysis(content, fileName, filePath);
    } else if (filePath.includes('security-key')) {
      return parseSecurityKeyAnalysis(content, fileName, filePath);
    } else if (filePath.includes('synthetic_vuln_inputs')) {
      return parseVulnInputsAnalysis(content, fileName, filePath);
    } else if (filePath.includes('wifi_passwords')) {
      return parseWifiAnalysis(content, fileName, filePath);
    }

    return null;
  } catch (error) {
    console.error(`Error parsing analysis file ${filePath}:`, error);
    return null;
  }
};

// Get severity color for styling
export const getSeverityColor = (severity: string): string => {
  switch (severity.toUpperCase()) {
    case 'CRITICAL':
      return '#FF3864';
    case 'HIGH':
      return '#FFB800';
    case 'MEDIUM':
      return '#00FFFF';
    case 'LOW':
      return '#00FFB3';
    default:
      return '#8B92A0';
  }
};

// Get risk level color
export const getRiskLevelColor = (riskLevel: string): string => {
  switch (riskLevel.toUpperCase()) {
    case 'CRITICAL':
      return '#FF3864';
    case 'HIGH':
      return '#FFB800';
    case 'MEDIUM':
      return '#00FFFF';
    case 'LOW':
      return '#00FFB3';
    default:
      return '#8B92A0';
  }
};

// Format analysis date
export const formatAnalysisDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};