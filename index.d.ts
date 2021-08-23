// declare module "@bimdata/areas" {
//   export default Areas.AreasFactory;
// }

declare namespace Areas {
  interface Areas {
    getZone(zoneId: number): Zone;
    getParent(node: Node): Container;
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
