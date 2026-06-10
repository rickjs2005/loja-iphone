import { conditionLabel } from "@/lib/data/types";

/**
 * Estado real do aparelho cadastrado no admin: saúde da bateria (com barra)
 * e condição estética. Linhas com valor null são omitidas; sem nenhum dado,
 * o bloco inteiro some.
 */
export function ConditionCard({
  batteryHealth,
  condition,
}: {
  batteryHealth: number | null;
  condition: string | null;
}) {
  const condLabel = conditionLabel(condition);
  if (batteryHealth === null && !condLabel) return null;

  return (
    <div className="mt-5 flex flex-col gap-4 rounded-2xl border border-white/10 bg-surface/60 p-4">
      <h2 className="text-sm font-semibold text-fg">Estado do aparelho</h2>

      {batteryHealth !== null && (
        <div>
          <div className="flex items-baseline justify-between text-sm">
            <span className="text-muted">Saúde da bateria</span>
            <span className="font-semibold tabular-nums text-fg">
              {batteryHealth}%
            </span>
          </div>
          <div
            role="progressbar"
            aria-label="Saúde da bateria"
            aria-valuenow={batteryHealth}
            aria-valuemin={0}
            aria-valuemax={100}
            className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10"
          >
            <div
              className="h-full rounded-full bg-primary"
              style={{ width: `${Math.min(100, Math.max(0, batteryHealth))}%` }}
            />
          </div>
        </div>
      )}

      {condLabel && (
        <div className="flex items-baseline justify-between text-sm">
          <span className="text-muted">Condição</span>
          <span className="font-semibold text-fg">{condLabel}</span>
        </div>
      )}
    </div>
  );
}
