import OverlayWrapper from './OverlayWrapper';

interface PoliceStationOverlayProps {
  onClose: () => void;
}

export default function PoliceStationOverlay({ onClose }: PoliceStationOverlayProps) {
  return (
    <OverlayWrapper title="Financial Protection Station" onClose={onClose}>
      <div className="space-y-6">
        <section>
          <h3 className="text-xl font-semibold mb-3 text-gray-800">Protect Your Financial Identity</h3>
          <p className="text-gray-700 leading-relaxed">
            Financial fraud and identity theft are serious crimes. Learn how to protect yourself
            and your hard-earned money.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-3 text-gray-800">Common Scams to Avoid</h3>
          <div className="space-y-3">
            <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-400">
              <h4 className="font-semibold text-red-800 mb-2">Phishing Scams</h4>
              <p className="text-sm text-gray-700">
                Fake emails or texts pretending to be from your bank or government asking for
                personal information. Never click suspicious links!
              </p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-400">
              <h4 className="font-semibold text-orange-800 mb-2">Debt Collection Scams</h4>
              <p className="text-sm text-gray-700">
                Scammers threatening arrest or legal action for debts you don't owe. Real collectors
                must verify debts in writing.
              </p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
              <h4 className="font-semibold text-yellow-800 mb-2">Too Good to Be True Offers</h4>
              <p className="text-sm text-gray-700">
                "Guaranteed" credit repair, work-from-home schemes, or investment opportunities
                promising high returns with no risk.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-3 text-gray-800">Protection Tips</h3>
          <div className="bg-blue-50 p-4 rounded-lg">
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Monitor your credit report regularly (free at AnnualCreditReport.com)</li>
              <li>Use strong, unique passwords for each account</li>
              <li>Enable two-factor authentication wherever possible</li>
              <li>Shred documents with personal information</li>
              <li>Be cautious about sharing personal info on social media</li>
              <li>Check your bank statements weekly</li>
            </ul>
          </div>
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-3 text-gray-800">If You're a Victim</h3>
          <div className="bg-green-50 p-4 rounded-lg">
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Contact your bank and credit card companies immediately</li>
              <li>Place a fraud alert on your credit reports</li>
              <li>File a report at IdentityTheft.gov</li>
              <li>File a police report</li>
              <li>Document everything</li>
            </ol>
          </div>
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-3 text-gray-800">Resources</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <ul className="space-y-1 text-gray-700 text-sm">
              <li><strong>Federal Trade Commission:</strong> FTC.gov/scams</li>
              <li><strong>Identity Theft Resource Center:</strong> IDTHEFTCENTER.org</li>
              <li><strong>Consumer Financial Protection Bureau:</strong> ConsumerFinance.gov</li>
            </ul>
          </div>
        </section>
      </div>
    </OverlayWrapper>
  );
}
