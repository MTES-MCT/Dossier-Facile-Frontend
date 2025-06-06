/* eslint-env node */
const IN_PRODUCTION = process.env.NODE_ENV === 'production'

module.exports = {
  plugins: [
    IN_PRODUCTION &&
      require('@fullhuman/postcss-purgecss').purgeCSSPlugin({
        content: [`./public/**/*.html`, `./src/**/*.vue`, `../df-shared-next/src/**/*.vue`],
        defaultExtractor(content) {
          const contentWithoutStyleBlocks = content.replace(/<style[^]+?<\/style>/gi, '')
          return contentWithoutStyleBlocks.match(/[A-Za-z0-9-_/:]*[A-Za-z0-9-_/]+/g) || []
        },
        safelist: [
          /-(leave|enter|appear)(|-(to|from|active))$/,
          /^(?!(|.*?:)cursor-move).+-move$/,
          /^router-link(|-exact)-active$/,
          /.*fr-accordion.*/,
          /.*fr-collapse.*/,
          /.*fr-modal.*/,
          /data-v-.*/
        ]
      })
  ]
}
