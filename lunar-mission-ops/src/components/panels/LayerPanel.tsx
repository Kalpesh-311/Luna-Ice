import { useMissionStore } from '../../store/missionStore';
import { HAZARD_COLORS, type LayerConfig } from '../../types/mission';

export function LayerPanel() {
  const layers = useMissionStore((s) => s.layers);
  const toggleLayer = useMissionStore((s) => s.toggleLayer);
  const setLayerOpacity = useMissionStore((s) => s.setLayerOpacity);

  const baseLayers = layers.filter((l) => l.category === 'base');
  const analysisLayers = layers.filter((l) => l.category === 'analysis');
  const vectorLayers = layers.filter((l) => l.category === 'vector');

  return (
    <aside className="panel panel-left">
      <header className="panel-header">
        <h2>Mission Assets</h2>
        <span className="panel-sub">Layer Control</span>
      </header>

      <LayerGroup title="Base Imagery" layers={baseLayers} onToggle={toggleLayer} onOpacity={setLayerOpacity} />
      <LayerGroup title="Analytical Layers" layers={analysisLayers} onToggle={toggleLayer} onOpacity={setLayerOpacity} />
      <LayerGroup title="Vector Overlays" layers={vectorLayers} onToggle={toggleLayer} onOpacity={setLayerOpacity} />

      <div className="legend-block">
        <h3>Hazard Legend</h3>
        <ul className="legend-list">
          {(Object.entries(HAZARD_COLORS) as [string, string][]).map(([cls, color]) => (
            <li key={cls}>
              <span className="legend-swatch" style={{ background: color }} />
              {cls.charAt(0).toUpperCase() + cls.slice(1)}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

function LayerGroup({
  title,
  layers,
  onToggle,
  onOpacity,
}: {
  title: string;
  layers: LayerConfig[];
  onToggle: (id: string) => void;
  onOpacity: (id: string, v: number) => void;
}) {
  return (
    <section className="layer-group">
      <h3>{title}</h3>
      {layers.map((layer) => (
        <div key={layer.id} className={`layer-item ${layer.available ? '' : 'disabled'}`}>
          <label className="layer-toggle">
            <input
              type="checkbox"
              checked={layer.visible}
              disabled={!layer.available}
              onChange={() => onToggle(layer.id)}
            />
            <span className="layer-name">{layer.name}</span>
          </label>
          {layer.available && layer.category !== 'vector' && (
            <div className="layer-opacity">
              <input
                type="range"
                min={0}
                max={100}
                value={Math.round(layer.opacity * 100)}
                onChange={(e) => onOpacity(layer.id, Number(e.target.value) / 100)}
              />
              <span>{Math.round(layer.opacity * 100)}%</span>
            </div>
          )}
          <p className="layer-desc">{layer.description}</p>
        </div>
      ))}
    </section>
  );
}
