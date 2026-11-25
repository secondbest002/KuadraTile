import type { LinearFactor, PolynomialCoefficients } from '../../types/algebra';

/** Merender faktor linear (x + a) atau (x − a) dengan tipografi matematika semantik. */
export function LinearFactorExpr({ factor }: { factor: LinearFactor }) {
  const isNeg = factor.constant < 0;
  const absC = Math.abs(factor.constant);

  return (
    <span className="inline-flex items-baseline whitespace-nowrap font-semibold tabular-nums">
      <span>(</span>
      <var className="italic font-serif font-semibold not-italic-override">x</var>
      <span className="mx-1">{isNeg ? '−' : '+'}</span>
      <span>{absC}</span>
      <span>)</span>
    </span>
  );
}

/** Merender perkalian dua faktor (x + a)(x + b) atau (x + a)². */
export function ProductExpr({
  factor1,
  factor2,
  className = '',
}: {
  factor1: LinearFactor;
  factor2: LinearFactor;
  className?: string;
}) {
  const isSquare = factor1.constant === factor2.constant;

  if (isSquare) {
    return (
      <span className={`inline-flex items-baseline whitespace-nowrap ${className}`}>
        <LinearFactorExpr factor={factor1} />
        <sup className="ml-0.5 text-[0.7em] font-bold">2</sup>
      </span>
    );
  }

  return (
    <span className={`inline-flex items-baseline whitespace-nowrap ${className}`}>
      <LinearFactorExpr factor={factor1} />
      <LinearFactorExpr factor={factor2} />
    </span>
  );
}

/** Merender polinomial Ax² + Bx + C dengan penyembunyian suku bernilai 0. */
export function PolynomialExpr({
  coeffs,
  className = '',
}: {
  coeffs: PolynomialCoefficients;
  className?: string;
}) {
  const parts: Array<{ key: string; sign: string; coeff: string; degree: 0 | 1 | 2 }> = [];

  if (coeffs.A !== 0) {
    const absA = Math.abs(coeffs.A);
    parts.push({
      key: 'A',
      sign: coeffs.A < 0 ? '−' : '',
      coeff: absA === 1 ? '' : String(absA),
      degree: 2,
    });
  }

  if (coeffs.B !== 0) {
    const absB = Math.abs(coeffs.B);
    const prefix = parts.length === 0 ? (coeffs.B < 0 ? '−' : '') : coeffs.B < 0 ? ' − ' : ' + ';
    parts.push({
      key: 'B',
      sign: prefix,
      coeff: absB === 1 ? '' : String(absB),
      degree: 1,
    });
  }

  if (coeffs.C !== 0 || parts.length === 0) {
    const absC = Math.abs(coeffs.C);
    const prefix = parts.length === 0 ? (coeffs.C < 0 ? '−' : '') : coeffs.C < 0 ? ' − ' : ' + ';
    parts.push({
      key: 'C',
      sign: prefix,
      coeff: String(absC),
      degree: 0,
    });
  }

  return (
    <span className={`inline-flex items-baseline whitespace-nowrap font-semibold tabular-nums ${className}`}>
      {parts.map((part) => (
        <span key={part.key} className="inline-flex items-baseline">
          {part.sign && <span className="whitespace-pre">{part.sign}</span>}
          {part.coeff && <span>{part.coeff}</span>}
          {part.degree >= 1 && <var className="italic font-serif">x</var>}
          {part.degree === 2 && <sup className="ml-0.5 text-[0.7em] font-bold">2</sup>}
        </span>
      ))}
    </span>
  );
}
