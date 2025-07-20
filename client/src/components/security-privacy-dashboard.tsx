import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, Lock, Key, Eye, EyeOff, CheckCircle, AlertTriangle, Smartphone, Download, Users } from "lucide-react";

export function SecurityPrivacyDashboard() {
  const [showApiKey, setShowApiKey] = useState(false);
  const [mfaEnabled, setMfaEnabled] = useState(false);

  const securityFeatures = [
    {
      icon: <Lock className="w-5 h-5" />,
      title: "End-to-End Encryption",
      description: "All your financial data is encrypted using AES-256 encryption",
      status: "active",
      detail: "Your data is encrypted both in transit and at rest"
    },
    {
      icon: <Key className="w-5 h-5" />,
      title: "Multi-Factor Authentication",
      description: "Add an extra layer of security to your account",
      status: mfaEnabled ? "active" : "inactive",
      detail: "Use your phone or authenticator app for secure login"
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: "Bank-Level Security",
      description: "Same security standards used by major financial institutions",
      status: "active",
      detail: "SOC 2 Type II compliant with regular security audits"
    },
    {
      icon: <Eye className="w-5 h-5" />,
      title: "Privacy Controls",
      description: "Full control over your data sharing and privacy settings",
      status: "active",
      detail: "You decide what data is shared and with whom"
    }
  ];

  const dataPolicy = [
    {
      category: "Data Collection",
      description: "We only collect data necessary for financial analysis and recommendations",
      items: [
        "Transaction amounts and categories",
        "Budget preferences and goals",
        "Price tracking selections"
      ]
    },
    {
      category: "Data Usage",
      description: "Your data is used exclusively for providing personalized financial insights",
      items: [
        "AI-powered spending analysis",
        "Personalized budget recommendations",
        "Price prediction algorithms"
      ]
    },
    {
      category: "Data Sharing",
      description: "We never sell or share your personal financial data with third parties",
      items: [
        "No data selling to advertisers",
        "No sharing with marketing companies",
        "Anonymous usage statistics only"
      ]
    }
  ];

  const getStatusBadge = (status: string) => {
    if (status === 'active') {
      return <Badge className="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 border-green-200 dark:border-green-800">Active</Badge>;
    }
    return <Badge className="bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 border-yellow-200 dark:border-yellow-800">Setup Required</Badge>;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-600 rounded-xl flex items-center justify-center glow-pulse icon-container cursor-pointer">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Security & Privacy
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Your data protection and privacy controls
            </p>
          </div>
        </div>
      </div>

      {/* Security Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {securityFeatures.map((feature, index) => (
          <Card key={index} className="glass-card scale-in">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  feature.status === 'active' 
                    ? 'bg-green-100 dark:bg-green-900/20 text-green-600' 
                    : 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600'
                }`}>
                  {feature.icon}
                </div>
                {getStatusBadge(feature.status)}
              </div>
              
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                {feature.description}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-500">
                {feature.detail}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Security Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-600 rounded-xl flex items-center justify-center glow-pulse icon-container cursor-pointer">
                <Key className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Account Security
              </h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Smartphone className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                  <div>
                    <div className="font-medium text-slate-900 dark:text-white">
                      Two-Factor Authentication
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      {mfaEnabled ? 'Enabled via SMS' : 'Add extra security to your account'}
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() => setMfaEnabled(!mfaEnabled)}
                  className="btn-premium"
                >
                  {mfaEnabled ? 'Disable' : 'Enable'}
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Key className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                  <div>
                    <div className="font-medium text-slate-900 dark:text-white">
                      API Access Key
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      For connecting external applications
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowApiKey(!showApiKey)}
                  >
                    {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                  <Button size="sm" className="btn-premium">
                    Regenerate
                  </Button>
                </div>
              </div>

              {showApiKey && (
                <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg font-mono text-sm">
                  ff_sk_1234567890abcdef...
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-600 rounded-xl flex items-center justify-center glow-pulse icon-container cursor-pointer">
                <Download className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Data Management
              </h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                <div>
                  <div className="font-medium text-slate-900 dark:text-white">
                    Export Your Data
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    Download all your financial data in JSON format
                  </div>
                </div>
                <Button variant="outline" className="btn-premium">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 border border-red-200 dark:border-red-800 rounded-lg bg-red-50/30 dark:bg-red-900/10">
                <div>
                  <div className="font-medium text-red-900 dark:text-red-200">
                    Delete Account
                  </div>
                  <div className="text-sm text-red-600 dark:text-red-400">
                    Permanently remove your account and all data
                  </div>
                </div>
                <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
                  Delete
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Privacy Policy Transparency */}
      <Card className="glass-card">
        <CardContent className="p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-teal-600 rounded-xl flex items-center justify-center glow-pulse icon-container cursor-pointer">
              <Users className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Data Privacy & Usage Policy
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {dataPolicy.map((policy, index) => (
              <div key={index} className="space-y-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <h4 className="font-semibold text-slate-900 dark:text-white">
                    {policy.category}
                  </h4>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {policy.description}
                </p>
                <ul className="space-y-1">
                  {policy.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="text-xs text-slate-500 dark:text-slate-500 flex items-start space-x-2">
                      <span className="w-1 h-1 bg-slate-400 rounded-full mt-1.5 flex-shrink-0"></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Compliance & Certifications */}
      <Card className="glass-card">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Security Certifications & Compliance
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
              <Shield className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="font-medium text-slate-900 dark:text-white text-sm">SOC 2 Type II</div>
              <div className="text-xs text-slate-500 dark:text-slate-500">Audited Security</div>
            </div>
            
            <div className="text-center p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
              <Lock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="font-medium text-slate-900 dark:text-white text-sm">GDPR Compliant</div>
              <div className="text-xs text-slate-500 dark:text-slate-500">Data Protection</div>
            </div>
            
            <div className="text-center p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
              <Key className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="font-medium text-slate-900 dark:text-white text-sm">AES-256</div>
              <div className="text-xs text-slate-500 dark:text-slate-500">Encryption</div>
            </div>
            
            <div className="text-center p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
              <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="font-medium text-slate-900 dark:text-white text-sm">PCI DSS</div>
              <div className="text-xs text-slate-500 dark:text-slate-500">Payment Security</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}