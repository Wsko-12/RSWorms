const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");


const base = {
    mode:'development',
    
    module: {
        rules: [
          {
            test: /\.tsx?$/,
            use: 'ts-loader',
            exclude: /node_modules/,
          },
          {
            test: /\.s[ac]ss$/i,
            use: [
              "style-loader",
              "css-loader",
              'sass-loader',
              {
                loader: 'sass-resources-loader',
                options: {
                  resources: ['./app/client/style/main.scss']
                },
              },
            ],
          },
        ],
      },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
}


const serverConfig = {
  target: 'node',
  entry: path.resolve(__dirname, 'app/server/index.ts'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'app.js',
  },
  ...base,
};

const clientConfig = {
  target: 'web', 
  entry: path.resolve(__dirname, 'app/client/index.ts'),
  output: {
    path: path.resolve(__dirname, 'dist/client'),
    filename: 'index[hash].js',
  },
  plugins: [ 
    new CopyPlugin({
      patterns:[
        {
            from: path.resolve(__dirname, 'app/client/assets/'),
            to: path.resolve(__dirname, 'dist/client/assets/'),
        }
    //   {
    //     from: path.resolve(__dirname, 'app/client/app/assets/textures/src'),
    //     to: path.resolve(__dirname, 'dist/client/assets/textures'),
    //   },
    //   {
    //     from: path.resolve(__dirname, 'app/client/app/assets/geometries/src'),
    //     to: path.resolve(__dirname, 'dist/client/assets/geometries'),
    //   }
    ]
    }),
    new HtmlWebpackPlugin({
      template: 'app/client/index.html'
    }),
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns:["**/*","!assets"],
    }),
  ],
  ...base,
};

module.exports = [serverConfig, clientConfig];