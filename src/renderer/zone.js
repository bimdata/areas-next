import { h } from "vue";

/**
 * @param { Areas.Zone } zone
 */
function renderZone(core, zone, deltaPx = 0) {
  const container = core.getParent(zone);

  const options = {
    class: "areas-zone",
    id: `zone-${zone.id}`,
    key: zone.id,
  };

  if (container) {
    if (container.direction === "column") {
      options.style = {
        height: `calc(${zone.ratio}% - ${deltaPx}px)`,
        width: "100%",
      };
    } else {
      options.style = {
        height: "100%",
        width: `calc(${zone.ratio}% - ${deltaPx}px)`,
      };
    }
  }

  return h("div", options, `zone-id-${zone.id}`);
}

export default renderZone;
