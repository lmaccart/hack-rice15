import OverlayWrapper from './OverlayWrapper';

interface BistroOverlayProps {
  onClose: () => void;
}

export default function BistroOverlay({ onClose }: BistroOverlayProps) {
  return (
    <OverlayWrapper title="Budgeting Bistro" onClose={onClose}>
      <div className="space-y-6">
        <section>
          <h3 className="text-xl font-semibold mb-3 text-gray-800">Why Budget?</h3>
          <p className="text-gray-700 leading-relaxed">
            A budget is a plan for your money. It helps you track income and expenses so you can
            achieve your financial goals and avoid overspending.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-3 text-gray-800">The 50/30/20 Rule</h3>
          <div className="space-y-3">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-blue-800">50% - Needs</h4>
                <span className="text-2xl font-bold text-blue-600">50%</span>
              </div>
              <p className="text-sm text-gray-700">
                Essential expenses like rent, groceries, utilities, transportation, insurance
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-purple-800">30% - Wants</h4>
                <span className="text-2xl font-bold text-purple-600">30%</span>
              </div>
              <p className="text-sm text-gray-700">
                Entertainment, dining out, hobbies, subscriptions, non-essential shopping
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-green-800">20% - Savings & Debt</h4>
                <span className="text-2xl font-bold text-green-600">20%</span>
              </div>
              <p className="text-sm text-gray-700">
                Emergency fund, retirement savings, debt payments beyond minimums
              </p>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-3 text-gray-800">Budgeting Tips</h3>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Track every expense for a month to understand your spending</li>
              <li>Use budgeting apps or spreadsheets</li>
              <li>Review and adjust your budget monthly</li>
              <li>Build an emergency fund of 3-6 months expenses</li>
              <li>Automate savings by setting up automatic transfers</li>
              <li>Cut one unnecessary expense each month</li>
            </ul>
          </div>
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-3 text-gray-800">Common Budgeting Mistakes</h3>
          <div className="bg-red-50 p-4 rounded-lg">
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-red-500 mr-2">✗</span>
                <span>Not tracking small purchases (they add up!)</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-2">✗</span>
                <span>Being too restrictive (allow some fun money)</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-2">✗</span>
                <span>Forgetting irregular expenses (car repairs, gifts)</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-2">✗</span>
                <span>Not adjusting when life changes</span>
              </li>
            </ul>
          </div>
        </section>
      </div>
    </OverlayWrapper>
  );
}
