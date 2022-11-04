declare module "@bimdata/areas-next" {
  export default Areas.AreasFactory;
}

declare namespace Areas {
  function AreasFactory(vue: Vue, layoutData: Object): Areas;

  interface Destroyable {
    destroy(): void;
  }

  type Layout = Zone | Container;

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
    direction: Direction;
    children: Array<ContainerChild>;
  }

  interface ContainerChild extends Node {
    ratio: number;
  }

  enum Direction {
    row = "row",
    column = "column",
  }

  interface Zone extends Node {
    type: NodeType.zone;
  }

  interface Areas extends Destroyable {
    readonly core: Core;
    readonly renderer: Renderer;
    readonly layout: Layout;
    /**
     * Swap the contents of two zones.
     *
     * @param { number } srcZoneId id of the source zone
     * @param { number } targetZoneId id of the target zone
     */
    swap(srcZoneId: number, targetZoneId: number): void;
    /**
     * Split zone.
     *
     * @param { number } zoneId
     * @param { number } [ratio=50]
     * @param { Direction } [direction="row"]
     * @param { boolean } [insertAfter=true]
     */
    split(
      zoneId: number,
      ratio?: number,
      direction?: Direction,
      insertAfter?: boolean
    ): Promise<void>;
    /**
     * Split layout.
     *
     * @param { number } [ratio=50]
     * @param { Direction } [direction="row"]
     * @param { boolean } [insertAfter=true]
     */
    splitLayout(
      ratio?: number,
      direction?: Direction,
      insertAfter?: boolean,
      cfg?: { content?: string; options?: Object }
    ): Promise<void>;
    delete(zoneId: number): Promise<void>;
    registerContent(name: string, content: Component): void;
    readonly component: VueComponentInstance;
  }

  /**
   * Vue.js Component declaration
   */
  interface Component {}

  /**
   * Vue.js Component options declaration
   */
  interface ContentOptions {}

  /**
   * Vue.js Component instance
   */
  interface VueComponentInstance {}

  /**
   * Vue.js
   */
  interface Vue {}

  /**
   * Vue.js vnode
   */
  interface VNode {}

  interface Core {
    layout: Layout;
    zoneIdManager: IdManager;
    containerIdManager: IdManager;
    getZone(zoneId: number): Zone;
    getParent(containerChild: ContainerChild): Container;
    deleteZone(zoneId: number): boolean | Zone;
    getNodes(): Node[];
    resize(containerChild: ContainerChild, value: number): boolean;
    splitZone(
      zoneId: number,
      ratio?: number,
      direction?: Direction,
      insertAfter?: boolean
    ): Zone;
    splitLayout(
      ratio?: number,
      direction?: Direction,
      insertAfter?: boolean,
      cfg?: { content?: string; options?: Object }
    ): Zone;
    swapZones(zoneId1: number, zoneId2: number): void;
  }

  interface IdManager {
    nextId(): number;
    isIdAvailable(): boolean;
    add(id: number): boolean | number;
  }

  interface Renderer extends Destroyable {
    root: VueComponentInstance;
    vue: Vue;
    core: Core;
    resize(containerChild: ContainerChild, value: number): void;
    getParent(containerChild: ContainerChild): Container;
    readonly width: number;
    readonly heigth: number;
    readonly separatorSize: number;
    split(
      zoneId: number,
      ratio: number,
      direction: Direction,
      insertAfter: boolean
    ): Promise<void>;
    splitLayout(
      ratio: number,
      direction: Direction,
      insertAfter: boolean,
      cfg?: { content?: string; options?: Object }
    ): Promise<void>;
    delete(zoneId: number): Promise<void>;
    contentManager: ContentManager;
    readonly component: VueComponentInstance;
  }

  interface ContentManager {
    registerContent(name: string, component: Object): void;
    renderContent(layout: Layout): VNode;
    link(): void;
    getRef(zoneId: number): { value: any };
    swap(srcZoneId: number, targetZoneId: number): void;
    deleteZoneContent(zoneId: number): void;
  }

  interface Content {
    name: string;
    component: Object;
  }

  interface ContentInstance extends Content {
    options: { zoneId: number; key: number } | any;
    ref: { value: any };
  }
}
