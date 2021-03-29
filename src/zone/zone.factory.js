/**
 * @param { AreasRoot } areas
 *
 * @returns { AreasZone }
 */
function makeZoneFactory(areas) {
  return {
    make(id) {
      const zone = document.createElement("areas-zone");
      zone.setAttribute("id", id);

      zone.root = areas;

      if (zone.root.modeAttribute) {
        zone.setAttribute(zone.root.modeAttribute, true);
      }
      return zone;
    },
  };
}

export default makeZoneFactory;
