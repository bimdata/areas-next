declare module "@bimdata/areas" {
  export default Areas.AreasFactory;
}

declare namespace Areas {
  function AreasFactory(htmlElement: HTMLElement, layoutData: Object): Areas;

  interface Areas extends Destroyable {
    readonly core: Core;
    readonly renderer: Renderer;
  }

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

  interface Destroyable {
    destroy(): void;
  }

  interface Renderer extends Destroyable {
    readonly root: Object;
    resize(containerChild: ContainerChild, value): boolean;
    getParent(containerChild: ContainerChild): Container;
    readonly width: number;
    readonly heigth: number;
    readonly separatorSize: number;
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
