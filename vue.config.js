const crypto = require('crypto');
/**
 * The  The MD4 algorithm is not available anymore in Node.js 17.0.0 and above.
 * Replace it with the MD5 algorithm.
 * 
 */
try {
  crypto.createHash('md4');

} catch (err) {
  console.warn('The MD4 algorithm is not available anymore in Node.js 17.0.0 and above. Replacing it with the MD5 algorithm.');
  const originalCreateHash = crypto.createHash;
  crypto.createHash = (algorithm, options) => {
    if (algorithm === 'md4') {
      return originalCreateHash('md5', options);
    }
    return originalCreateHash(algorithm, options);
  }
}

module.exports = {
  configureWebpack: {
    resolve: {
      fallback: {
        "stream": require.resolve("stream-browserify"),
        "constants": require.resolve("constants-browserify"),
        "os": require.resolve("os-browserify/browser"),
        "crypto": require.resolve("crypto-browserify"),
        "fs": require.resolve("browserify-fs")
    }
  }
  },
  
  lintOnSave: false,
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        "afterSign": "build/notarize.js",
        "appId": "net.corporateclash.mac",
        "productName": "Toontown: Corporate Clash",
        "copyright": "Copyright © 2019 Corporate Clash",
        "win": {
          "target": "nsis",
          "publisherName": "Corporate Clash",
          "publish": ["github"]
        },
        "mac": {
          "publish": ["github"],
          "category": "public.app-category.strategy-games",
          "minimumSystemVersion": "10.12.0",
          "entitlements": "build/entitlements.mac.plist",
          "entitlementsInherit": "build/entitlements.mac.plist",
          "hardenedRuntime": true,
          "gatekeeperAssess": false,
          // target universal2 
          arch : [
            "arm64",
            "x86_64"
          ]
        },
        "publish": {
          "provider": "github",
          "private": false
        },
      }
    }
  }
}


