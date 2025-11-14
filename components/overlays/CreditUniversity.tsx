import OverlayWrapper from './OverlayWrapper';

interface CreditUniversityProps {
  onClose: () => void;
}

export default function CreditUniversity({ onClose }: CreditUniversityProps) {
  return (
    <OverlayWrapper title="Credit University" onClose={onClose}>
      <div className="space-y-6">
        <section>
          <h3 className="text-xl font-semibold mb-3 text-gray-800">What is Credit?</h3>
          <p className="text-gray-700 leading-relaxed">
            Credit is your ability to borrow money or access goods/services with the understanding
            that you'll pay later. Your credit score (300-850) represents your creditworthiness.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-3 text-gray-800">Credit Score Factors</h3>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start">
              <span className="font-semibold mr-2">35%</span>
              <span>Payment History - Pay on time, every time</span>
            </li>
            <li className="flex items-start">
              <span className="font-semibold mr-2">30%</span>
              <span>Amount Owed - Keep balances low (under 30% of limit)</span>
            </li>
            <li className="flex items-start">
              <span className="font-semibold mr-2">15%</span>
              <span>Length of Credit History - Keep old accounts open</span>
            </li>
            <li className="flex items-start">
              <span className="font-semibold mr-2">10%</span>
              <span>New Credit - Don't open too many accounts at once</span>
            </li>
            <li className="flex items-start">
              <span className="font-semibold mr-2">10%</span>
              <span>Credit Mix - Have different types of credit</span>
            </li>
          </ul>
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-3 text-gray-800">Building Credit</h3>
          <div className="bg-blue-50 p-4 rounded-lg">
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Get a secured credit card or become an authorized user</li>
              <li>Pay all bills on time, every time</li>
              <li>Keep credit utilization below 30%</li>
              <li>Monitor your credit report regularly</li>
              <li>Be patient - building credit takes time</li>
            </ul>
          </div>
        </section>
      </div>
    </OverlayWrapper>
  );
}
