const isProduction = process.env.BUILD === "production";
console.log(
  `ROLLUP -- Building for ${isProduction ? "PRODUCTION" : "DEVELOPMENT"}`
);

export default {
  input: "src/main.js",
  output: [
    {
      name: "Areas",
      file: "dist/areas.js",
      format: "umd",
      sourcemap: !isProduction,
    },
    {
      file: "dist/areas.esm.js",
      format: "es",
      sourcemap: !isProduction,
    },
  ],
};
