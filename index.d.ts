// declare module "@bimdata/areas" {
//   export default Areas.AreasFactory;
// }

declare namespace Areas {

  interface AreasElement {
    el: HTMLElement
  }

  interface Container extends AreasElement{

  }

  interface Separator extends AreasElement {
    mouseMoveListener(): void;
    container: Container
  }
}