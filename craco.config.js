// craco.config.js
module.exports = {
    webpack: {
      configure: (webpackConfig) => {
        webpackConfig.module.rules = webpackConfig.module.rules.map((rule) => {
          if (rule.oneOf) {
            rule.oneOf = rule.oneOf.map((loader) => {
              if (
                loader.loader &&
                loader.loader.includes("source-map-loader")
              ) {
                // Exclude html2pdf.js from source-map-loader
                loader.exclude = [
                  ...(loader.exclude || []),
                  /node_modules\/html2pdf\.js/,
                ];
              }
              return loader;
            });
          }
          return rule;
        });
  
        return webpackConfig;
      },
    },
  };
  