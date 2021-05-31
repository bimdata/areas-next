export default `
<style>
/* Container styles */
.container {
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  height: 100%;
  overflow: hidden;
}

/* Separator styles */
.separator {
  box-sizing: border-box;
  background-color: black;

  position: relative;
}

.grabber {
  position: absolute;
  opacity: 0;
}


/* Zone styles */
.zone {
  position: relative;
  display: block;
  box-sizing: border-box;
  background-color: cornsilk;
  height: 100%;
}

.zone .content {
  width: 100%;
  height: 100%;
}

.zone .overlay {
  display: none;
  position: absolute;
  opacity: 0.1;
  z-index: 1000; /* TODO may be configurable ... */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.zone .overlay .split-line {
  display: none;
  position: absolute;
  background-color: red;
}

.zone([deletable]:hover) .overlay {
  display: block;
  background-color: red;  /* TODO may be configurable with custom CSS prop ... */
  cursor: crosshair;
}
.zone([draggable]:hover) .overlay {
  display: block;
  background-color: green;  /* TODO may be configurable with custom CSS prop ... */
  cursor: grab;
}

.zone([splittable-v]:hover) .overlay {
  display: block;
  background-color: blue;  /* TODO may be configurable with custom CSS prop ... */
  cursor: row-resize;
}

.zone([splittable-v]:hover) .overlay .split-line {
  display: block;
  left: 0;
  width: 100%;
  height: 2px;
}

.zone([splittable-h]:hover) .overlay {
  display: block;
  background-color: blue;  /* TODO may be configurable with custom CSS prop ... */
  cursor: col-resize;
}

.zone([splittable-h]:hover) .overlay .split-line {
  display: block;
  top: 0;
  width: 2px;
  height: 100%;
}
</style>
`;
