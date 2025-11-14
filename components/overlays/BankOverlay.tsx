import OverlayWrapper from './OverlayWrapper';

interface BankOverlayProps {
  onClose: () => void;
}

export default function BankOverlay({ onClose }: BankOverlayProps) {
  return (
    <OverlayWrapper title="Community Bank" onClose={onClose}>
      <div className="space-y-6">
        <section>
          <h3 className="text-xl font-semibold mb-3 text-gray-800">Banking Basics</h3>
          <p className="text-gray-700 leading-relaxed">
            A bank is a safe place to store your money and access financial services.
            Understanding banking is crucial for financial literacy.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-3 text-gray-800">Types of Accounts</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">Checking Account</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• For everyday transactions</li>
                <li>• Comes with debit card</li>
                <li>• Easy access to funds</li>
                <li>• Low or no interest</li>
              </ul>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Savings Account</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• For saving money</li>
                <li>• Earns interest</li>
                <li>• Limited transactions</li>
                <li>• Emergency fund storage</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-3 text-gray-800">Banking Tips</h3>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Always read the fine print before opening an account</li>
              <li>Watch out for fees (overdraft, monthly maintenance, ATM)</li>
              <li>Set up direct deposit to save time</li>
              <li>Use mobile banking to track your spending</li>
              <li>Keep your account information secure</li>
            </ul>
          </div>
        </section>
      </div>
    </OverlayWrapper>
  );
}
