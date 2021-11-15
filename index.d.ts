// declare module "@bimdata/areas" {
//   export default Areas.AreasFactory;
// }

declare namespace Areas {
  interface Core {
    layout: Node;
    getZone(zoneId: number): Zone;
    getParent(containerChild: ContainerChild): Container;
    deleteZone(zoneId: number): Zone;
    getNodes(): Node[];
    resize(container: Container, child: ContainerChild, value: number): boolean;
    splitZone(
      zoneId: number,
      ratio: number,
      direction: ContainerDirection,
      insertAfter?: Boolean
    ): Zone;
    swapZones(zoneId1: number, zoneId2: number): void;
  }

  interface Renderer {
    root: Object;
    resize(containerChild: ContainerChild, value): boolean;
    getParent(containerChild: ContainerChild): Container;
  }

  enum NodeType {
    zone = "zone",
    container = "container",
  }

  interface Node {
    id: number;
    type: NodeType;
  }

  interface Container extends Node {
    type: NodeType.container;
    direction: ContainerDirection;
    children: Array<ContainerChild>;
  }

  interface Zone extends Node {
    type: NodeType.zone;
  }

  interface ContainerChild extends Node {
    ratio: number;
  }

  enum ContainerDirection {
    row = "row",
    column = "column",
  }
}
