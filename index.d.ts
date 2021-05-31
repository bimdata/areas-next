// declare module "@bimdata/areas" {
//   export default Areas.AreasFactory;
// }

declare namespace Areas {

  enum AreasMode {
    delete = "delete",
    swap = "swap",
    splitV = "split-v",
    splitH = "split-h"
  }

  enum AreasModeAttribute {
    splittableV = "splittable-v",
    splittableH = "splittable-h",
    draggable = "draggable",
    deletable = "deletable",
  }

  interface Areas {
    locked: boolean;
    mode?: AreasMode
    modeAttribute: AreasModeAttribute;
    separatorSize: number;
    zones: Array<HTMLElement>;
  }

  interface AreasElement {
    el: HTMLElement
  }

  enum NodeType {
    zone = "zone",
    container = "container"
  }

  type ContainerNode = {
    type: NodeType.container;
    ratio: number;
    direction: ContainerDirection;
    children: Array<ContainerNode | ZoneNode>;
  }

  type ZoneNode = {
    type: NodeType.zone;
    ratio: number;
  }

  type Layout = ContainerNode | ZoneNode;

  enum ContainerDirection {
    row = "row",
    column = "column",
  }

  interface Container extends AreasElement {
    separators: Separator[];
    areas: Areas.Areas
    ratios: number[];
    direction: ContainerDirection;
  }

  interface Zone {
    areas: Areas.Areas;
    id: number;
    container?: Container;
  }

  interface Separator extends AreasElement {
    mouseMoveListener(): void;
    container: Container
  }
}