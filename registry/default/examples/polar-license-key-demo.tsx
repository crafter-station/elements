"use client";

import { PolarLicenseKey } from "@/registry/default/blocks/polar/polar-license-key/components/elements/polar-license-key";

export default function PolarLicenseKeyDemo() {
  return (
    <div className="space-y-4 max-w-md">
      <PolarLicenseKey
        licenseKey="XXXX-ABCD-1234-EFGH-5678-WXYZ"
        productName="Pro License"
        status="active"
        activations={{ current: 2, limit: 5 }}
        expiresAt={new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)}
      />
      <PolarLicenseKey
        licenseKey="DEMO-TRIAL-KEY1-2345-6789-0000"
        productName="Trial License"
        status="pending"
        masked={false}
        size="sm"
      />
      <PolarLicenseKey
        licenseKey="EXPR-IRED-LICE-NSE0-1234-5678"
        productName="Expired License"
        status="expired"
        expiresAt={new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)}
      />
    </div>
  );
}
