import { h, ref } from "vue/dist/vue.esm-bundler.js";

/**
 *
 * @param {*} contentManager
 * @param {*} id
 * @param {*} content
 * @returns { Areas.Content }
 */
function makeContent(contentManager, id, content) {
  const contentRef = ref(null);

  return {
    render() {
      return content ? h(content, { ref: contentRef }) : null;
    },
    get dom() {
      return contentRef.value.$el;
    },
  };
}

export default makeContent;
