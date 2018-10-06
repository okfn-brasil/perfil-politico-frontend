const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const HtmlWebpackExcludeAssetsPlugin = require("html-webpack-exclude-assets-plugin");

module.exports = ({ mode } = { mode: "development" }) => {
  const devMode = mode !== "production";

  return {
    mode,
    entry: "./src/js/index.js",
    output: {
      filename: devMode ? "[name].js" : "[name].[hash].js",
      path: path.resolve(__dirname, "build")
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /(node_modules)/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"]
            }
          }
        },
        {
          test: /\.scss$/,
          use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"]
        },
        {
          test: /\.(png|jpg|gif|svg)$/,
          loader: "file-loader?name=images/[name].[ext]"
        },
        {
          test: /\.(eot|ttf|woff|woff2)$/,
          loader: "file-loader?name=fonts/[name].[ext]"
        },
        {
          test: /\.hbs$/,
          loader: "handlebars-loader",
          query: {
            partialDirs: [path.join(__dirname, "src", "html", "includes")]
          }
        }
      ]
    },
    optimization: {
      minimizer: [
        new UglifyJsPlugin({
          cache: true,
          parallel: true
        }),
        new OptimizeCSSAssetsPlugin({})
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./src/html/index.html.hbs",
        inject: true
      }),
      new HtmlWebpackPlugin({
        filename: "faq.html",
        template: "./src/html/faq.html.hbs",
        inject: true,
        excludeAssets: [/.js/]
      }),
      new HtmlWebpackPlugin({
        filename: "sobre.html",
        template: "./src/html/sobre.html.hbs",
        inject: true,
        excludeAssets: [/.js/]
      }),
      new MiniCssExtractPlugin({
        filename: devMode ? "[name].css" : "[name].[hash].css",
        chunkFilename: devMode ? "[id].css" : "[id].[hash].css"
      }),
      new CopyWebpackPlugin([{ from: "src/images", to: "images" }]),
      new HtmlWebpackExcludeAssetsPlugin()
    ],
    devServer: {
      contentBase: path.join(__dirname, "build"),
      compress: true
    }
  };
};
