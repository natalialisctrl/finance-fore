import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface BudgetCategory {
  name: string;
  currentAmount: number;
  suggestedAmount: number;
  priority: 'essential' | 'important' | 'optional';
  reasoning: string;
}

export interface ScenarioInput {
  scenarioType: 'pay_raise' | 'job_loss' | 'major_purchase' | 'economic_downturn' | 'new_baby' | 'moving' | 'debt_payoff';
  incomeChange: number; // Monthly change in income
  additionalExpenses?: { [key: string]: number }; // New monthly expenses
  timeframe: number; // Duration in months
  currentBudget: { [category: string]: number };
  totalIncome: number;
  description: string;
}

export interface BudgetRedistributionResult {
  redistributedBudget: BudgetCategory[];
  monthlySavings: number;
  emergencyFundTarget: number;
  debtPayoffStrategy: string[];
  investmentStrategy: string[];
  riskAssessment: string;
  actionPlan: string[];
  confidence: number;
}

export class AIBudgetRedistributor {
  async redistributeBudget(scenario: ScenarioInput): Promise<BudgetRedistributionResult> {
    try {
      // Use AI to analyze the scenario and redistribute budget
      const aiResult = await this.generateAIRedistribution(scenario);
      return aiResult;
    } catch (error) {
      console.error("AI redistribution failed, using algorithmic approach:", error);
      return this.algorithmicRedistribution(scenario);
    }
  }

  private async generateAIRedistribution(scenario: ScenarioInput): Promise<BudgetRedistributionResult> {
    const prompt = `You are a certified financial planner analyzing a budget redistribution scenario. 

SCENARIO DETAILS:
- Type: ${scenario.scenarioType}
- Monthly Income Change: $${scenario.incomeChange}
- Timeframe: ${scenario.timeframe} months
- Current Monthly Income: $${scenario.totalIncome}
- Description: ${scenario.description}

CURRENT BUDGET:
${Object.entries(scenario.currentBudget).map(([category, amount]) => `- ${category}: $${amount}`).join('\n')}

ADDITIONAL EXPENSES:
${scenario.additionalExpenses ? Object.entries(scenario.additionalExpenses).map(([expense, amount]) => `- ${expense}: $${amount}`).join('\n') : 'None'}

Please provide a comprehensive budget redistribution analysis that includes:

1. REDISTRIBUTED BUDGET: For each category, suggest new amounts with priority levels (essential/important/optional) and detailed reasoning
2. FINANCIAL STRATEGY: Emergency fund targets, debt payoff strategy, investment recommendations
3. RISK ASSESSMENT: Potential challenges and mitigation strategies
4. ACTION PLAN: Specific steps to implement this budget
5. CONFIDENCE LEVEL: Rate your confidence in this plan (60-95%)

Respond with JSON in this exact format:
{
  "redistributedBudget": [
    {
      "name": "category_name",
      "currentAmount": current_amount,
      "suggestedAmount": new_amount,
      "priority": "essential|important|optional",
      "reasoning": "detailed explanation for the change"
    }
  ],
  "monthlySavings": target_monthly_savings,
  "emergencyFundTarget": recommended_emergency_fund,
  "debtPayoffStrategy": ["strategy1", "strategy2"],
  "investmentStrategy": ["investment1", "investment2"],
  "riskAssessment": "comprehensive risk analysis",
  "actionPlan": ["step1", "step2", "step3"],
  "confidence": confidence_percentage
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are an expert financial planner with 20+ years of experience in budget optimization and scenario planning. Provide practical, actionable financial advice based on the scenario."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 2000
    });

    const result = JSON.parse(response.choices[0].message.content);
    return result as BudgetRedistributionResult;
  }

  private algorithmicRedistribution(scenario: ScenarioInput): BudgetRedistributionResult {
    const { currentBudget, incomeChange, scenarioType, totalIncome } = scenario;
    const newIncome = totalIncome + incomeChange;
    const redistributedBudget: BudgetCategory[] = [];

    // Calculate adjustment factor
    const adjustmentFactor = newIncome / totalIncome;

    // Redistribution logic based on scenario type
    Object.entries(currentBudget).forEach(([category, amount]) => {
      let suggestedAmount = amount;
      let priority: 'essential' | 'important' | 'optional' = 'important';
      let reasoning = '';

      switch (scenarioType) {
        case 'pay_raise':
          if (category.toLowerCase().includes('savings') || category.toLowerCase().includes('investment')) {
            suggestedAmount = amount + (incomeChange * 0.4); // 40% of raise to savings
            priority = 'important';
            reasoning = 'Increase savings to take advantage of higher income';
          } else if (category.toLowerCase().includes('emergency')) {
            suggestedAmount = amount + (incomeChange * 0.2); // 20% to emergency fund
            priority = 'essential';
            reasoning = 'Build stronger emergency fund with additional income';
          } else {
            suggestedAmount = amount * Math.min(adjustmentFactor, 1.1); // Cap lifestyle inflation at 10%
            priority = amount > 1000 ? 'important' : 'optional';
            reasoning = 'Moderate increase while avoiding lifestyle inflation';
          }
          break;

        case 'job_loss':
          if (category.toLowerCase().includes('essential') || category.toLowerCase().includes('housing') || category.toLowerCase().includes('utilities')) {
            suggestedAmount = amount; // Keep essentials
            priority = 'essential';
            reasoning = 'Maintain essential expenses during income loss';
          } else {
            suggestedAmount = amount * 0.3; // Cut non-essentials by 70%
            priority = 'optional';
            reasoning = 'Drastically reduce discretionary spending';
          }
          break;

        case 'major_purchase':
          if (category.toLowerCase().includes('discretionary') || category.toLowerCase().includes('entertainment')) {
            suggestedAmount = amount * 0.7; // Reduce discretionary by 30%
            priority = 'optional';
            reasoning = 'Reduce optional spending to accommodate major purchase';
          } else {
            suggestedAmount = amount;
            priority = 'important';
            reasoning = 'Maintain current allocation';
          }
          break;

        default:
          suggestedAmount = amount * adjustmentFactor;
          priority = 'important';
          reasoning = 'Proportional adjustment based on income change';
      }

      redistributedBudget.push({
        name: category,
        currentAmount: amount,
        suggestedAmount: Math.round(suggestedAmount),
        priority,
        reasoning
      });
    });

    // Calculate additional metrics
    const totalSuggested = redistributedBudget.reduce((sum, cat) => sum + cat.suggestedAmount, 0);
    const monthlySavings = Math.max(0, newIncome - totalSuggested);
    
    return {
      redistributedBudget,
      monthlySavings: Math.round(monthlySavings),
      emergencyFundTarget: Math.round(newIncome * 6), // 6 months of expenses
      debtPayoffStrategy: this.getDebtStrategy(scenarioType),
      investmentStrategy: this.getInvestmentStrategy(scenarioType, incomeChange),
      riskAssessment: this.getRiskAssessment(scenarioType),
      actionPlan: this.getActionPlan(scenarioType),
      confidence: 75
    };
  }

  private getDebtStrategy(scenarioType: string): string[] {
    switch (scenarioType) {
      case 'pay_raise':
        return ['Accelerate high-interest debt payments', 'Consider debt consolidation options'];
      case 'job_loss':
        return ['Focus on minimum payments only', 'Avoid taking on new debt'];
      case 'major_purchase':
        return ['Pause extra debt payments temporarily', 'Ensure purchase doesn\'t increase debt ratio'];
      default:
        return ['Continue current debt payment schedule', 'Review interest rates annually'];
    }
  }

  private getInvestmentStrategy(scenarioType: string, incomeChange: number): string[] {
    switch (scenarioType) {
      case 'pay_raise':
        return ['Increase 401k contributions', 'Consider opening Roth IRA', 'Diversify investment portfolio'];
      case 'job_loss':
        return ['Pause new investments', 'Keep existing investments if possible', 'Focus on cash preservation'];
      case 'economic_downturn':
        return ['Maintain conservative portfolio', 'Consider dollar-cost averaging', 'Focus on defensive stocks'];
      default:
        return ['Maintain current investment allocation', 'Review portfolio quarterly'];
    }
  }

  private getRiskAssessment(scenarioType: string): string {
    switch (scenarioType) {
      case 'pay_raise':
        return 'Low risk scenario with positive income trajectory. Main risk is lifestyle inflation.';
      case 'job_loss':
        return 'High risk scenario requiring immediate action. Emergency fund duration is critical.';
      case 'major_purchase':
        return 'Medium risk scenario. Ensure purchase doesn\'t compromise financial stability.';
      default:
        return 'Moderate risk scenario requiring careful monitoring and adjustment.';
    }
  }

  private getActionPlan(scenarioType: string): string[] {
    switch (scenarioType) {
      case 'pay_raise':
        return [
          'Immediately increase automatic savings transfers',
          'Review and increase 401k contribution percentage',
          'Update emergency fund target amount',
          'Consider upgrading insurance coverage'
        ];
      case 'job_loss':
        return [
          'Immediately cut all non-essential expenses',
          'Apply for unemployment benefits',
          'Review health insurance options (COBRA)',
          'Begin aggressive job search',
          'Consider temporary/gig work'
        ];
      default:
        return [
          'Implement budget changes gradually over 2-3 months',
          'Monitor actual vs. planned spending monthly',
          'Review and adjust after 3 months',
          'Set up automatic transfers for savings goals'
        ];
    }
  }
}

export const budgetRedistributor = new AIBudgetRedistributor();