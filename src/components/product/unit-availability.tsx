import { getStoreSettings } from "@/lib/data/site";
import { getProductInventory, getUnits } from "@/lib/data/units";

/**
 * Disponibilidade do produto por unidade física (server component).
 * Só aparece com o MODO de estoque por unidade ligado e 2+ unidades —
 * estoque compartilhado entre as lojas não tem o que detalhar aqui.
 */
export async function UnitAvailability({ productId }: { productId: string }) {
  const [settings, units, inventory] = await Promise.all([
    getStoreSettings(),
    getUnits(),
    getProductInventory(productId),
  ]);
  if (!settings.track_stock_by_unit || units.length < 2) return null;

  // Linha ausente no inventory = 0 naquela unidade.
  const stockByUnit = new Map(inventory.map((row) => [row.unit_id, row.stock]));

  return (
    <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-white/10 bg-surface/60 p-4">
      <h2 className="text-sm font-semibold text-fg">
        Disponibilidade nas lojas
      </h2>

      <ul className="flex flex-col gap-2">
        {units.map((unit) => {
          const stock = stockByUnit.get(unit.id) ?? 0;
          return (
            <li
              key={unit.id}
              className="flex items-baseline justify-between gap-4 text-sm"
            >
              <span className="text-muted">{unit.name}</span>
              {stock > 0 ? (
                <span className="font-semibold tabular-nums text-fg">
                  {stock} un.
                </span>
              ) : (
                <span className="text-muted">—</span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
