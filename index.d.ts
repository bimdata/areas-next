// declare module "@bimdata/areas" {
//   export default Areas.AreasFactory;
// }

declare namespace Areas {
  interface Core {
    layout: Node;
    getZone(zoneId: number): Zone;
    getParent(node: Node): Container;
    deleteZone(zoneId: number): Zone;
    getNodes(): Node[];
    resizeZone(zoneId: number, value:number): number;
    splitZone(zoneId: number, ratio: number, direction: ContainerDirection, insertAfter?: Boolean): Zone;
    swapZones(zoneId1: number, zoneId2: number): void;
  }

  interface Renderer {
    deleteZone(zoneId: number): Node;
    resizeZone(zoneId: number, value:number): Node;
    splitZone(zoneId: number, ratio: number, direction: ContainerDirection, insertAfter?: Boolean): Node;
    swapZones(zoneId1: number, zoneId2: number): Node;
  }

  enum NodeType {
    zone = "zone",
    container = "container"
  }

  type Node = Container | Zone;

  type Container = {
    id: number,
    type: NodeType.container;
    ratio?: number;
    direction: ContainerDirection;
    children: Array<Node>;
  }

  type Zone = {
    id: number,
    type: NodeType.zone;
    ratio?: number;
  }

  enum ContainerDirection {
    row = "row",
    column = "column",
  }
}
