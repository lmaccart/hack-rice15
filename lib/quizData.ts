import type { Quiz } from '@/types/userProgress';

export const quizzes: Record<string, Quiz> = {
  credituniversity: {
    buildingName: 'Credit University',
    questions: [
      {
        id: 'cu1',
        question: 'What percentage of your credit score is based on payment history?',
        options: ['10%', '25%', '35%', '50%'],
        correctAnswer: 2,
        explanation: 'Payment history makes up 35% of your credit score - the largest factor!',
      },
      {
        id: 'cu2',
        question: 'What is a good credit utilization ratio to maintain?',
        options: ['Under 10%', 'Under 30%', 'Under 50%', 'Under 70%'],
        correctAnswer: 1,
        explanation: 'Keeping your credit utilization below 30% is ideal for a healthy credit score.',
      },
      {
        id: 'cu3',
        question: 'What is the credit score range?',
        options: ['0-100', '200-800', '300-850', '500-1000'],
        correctAnswer: 2,
        explanation: 'Credit scores range from 300 to 850, with higher scores being better.',
      },
    ],
  },
  bank: {
    buildingName: 'Community Bank',
    questions: [
      {
        id: 'bank1',
        question: 'What type of account should you use for everyday transactions?',
        options: ['Savings Account', 'Checking Account', 'CD Account', 'Money Market Account'],
        correctAnswer: 1,
        explanation: 'Checking accounts are designed for frequent transactions and easy access to funds.',
      },
      {
        id: 'bank2',
        question: 'Which account type typically earns the most interest?',
        options: ['Checking', 'Savings', 'Both are the same', 'Neither earns interest'],
        correctAnswer: 1,
        explanation: 'Savings accounts typically earn interest, while most checking accounts do not.',
      },
      {
        id: 'bank3',
        question: 'What should you watch out for when opening a bank account?',
        options: ['Fees', 'Interest rates', 'Minimum balance requirements', 'All of the above'],
        correctAnswer: 3,
        explanation: 'All of these factors are important when choosing a bank account!',
      },
    ],
  },
  townhall: {
    buildingName: 'Town Hall',
    questions: [
      {
        id: 'th1',
        question: 'What are Individual Development Accounts (IDAs)?',
        options: [
          'A type of credit card',
          'Matched savings programs for low-income individuals',
          'A government loan program',
          'A type of checking account',
        ],
        correctAnswer: 1,
        explanation: 'IDAs are matched savings programs that help low-income individuals save for important goals.',
      },
      {
        id: 'th2',
        question: 'Which website offers free financial education resources?',
        options: ['MyMoney.gov', 'Instagram.com', 'Facebook.com', 'Twitter.com'],
        correctAnswer: 0,
        explanation: 'MyMoney.gov is a government website that provides free financial education resources.',
      },
      {
        id: 'th3',
        question: 'Can rent and utility payments help build credit?',
        options: ['No, never', 'Yes, through alternative credit reporting', 'Only rent', 'Only utilities'],
        correctAnswer: 1,
        explanation: 'Alternative credit reporting programs can use rent and utility payments to help build credit!',
      },
    ],
  },
  shop: {
    buildingName: 'Smart Shopping',
    questions: [
      {
        id: 'shop1',
        question: 'Which of these is a "need" rather than a "want"?',
        options: ['Designer clothes', 'Basic groceries', 'Latest smartphone', 'Streaming subscriptions'],
        correctAnswer: 1,
        explanation: 'Basic groceries are a necessity for survival, making them a need.',
      },
      {
        id: 'shop2',
        question: 'What should you do before making an impulse purchase?',
        options: ['Buy it immediately', 'Wait 24 hours', 'Ask friends', 'Check social media'],
        correctAnswer: 1,
        explanation: 'Waiting 24 hours helps you avoid impulse purchases and make better decisions.',
      },
      {
        id: 'shop3',
        question: 'When should you use a credit card for shopping?',
        options: [
          'Whenever you want something',
          'Only when you can pay the full balance',
          'To buy things you can\'t afford',
          'For all purchases',
        ],
        correctAnswer: 1,
        explanation: 'Only use credit cards when you can pay the full balance to avoid interest charges!',
      },
    ],
  },
  bistro: {
    buildingName: 'Budgeting Bistro',
    questions: [
      {
        id: 'bistro1',
        question: 'In the 50/30/20 rule, what does the 50% represent?',
        options: ['Wants', 'Needs', 'Savings', 'Investments'],
        correctAnswer: 1,
        explanation: 'The 50% in the 50/30/20 rule represents needs - essential expenses.',
      },
      {
        id: 'bistro2',
        question: 'What percentage should go to savings in the 50/30/20 rule?',
        options: ['10%', '20%', '30%', '50%'],
        correctAnswer: 1,
        explanation: '20% should go to savings and debt repayment in the 50/30/20 rule.',
      },
      {
        id: 'bistro3',
        question: 'How many months of expenses should your emergency fund cover?',
        options: ['1 month', '2-3 months', '3-6 months', '12 months'],
        correctAnswer: 2,
        explanation: 'Financial experts recommend having 3-6 months of expenses in your emergency fund.',
      },
    ],
  },
  policestation: {
    buildingName: 'Financial Protection',
    questions: [
      {
        id: 'police1',
        question: 'What should you do if you receive a suspicious email asking for personal information?',
        options: [
          'Reply immediately',
          'Click all links to verify',
          'Delete it and never click links',
          'Share it with friends',
        ],
        correctAnswer: 2,
        explanation: 'Never click suspicious links or provide personal information in response to unsolicited emails!',
      },
      {
        id: 'police2',
        question: 'How often should you check your credit report?',
        options: ['Never', 'Once a year', 'At least once a year', 'Every day'],
        correctAnswer: 2,
        explanation: 'You should check your credit report at least once a year for free at AnnualCreditReport.com.',
      },
      {
        id: 'police3',
        question: 'What is phishing?',
        options: [
          'A water sport',
          'A type of credit card',
          'Fraudulent attempts to get personal information',
          'A banking service',
        ],
        correctAnswer: 2,
        explanation: 'Phishing is when scammers try to trick you into giving away personal information through fake emails or websites.',
      },
    ],
  },
};
