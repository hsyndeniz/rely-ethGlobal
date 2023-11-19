import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, AppRegistry } from 'react-native';
import { WebView } from 'react-native-webview';
import { MainWorker, webViewWorkerString } from 'webview-crypto';
import App from './src/App';
import { name as appName } from './app.json';
import crypto from 'react-native-quick-crypto';

const styles = StyleSheet.create({
  hide: {
    display: 'none',
    position: 'absolute',
    width: 0,
    height: 0,
    flexGrow: 0,
    flexShrink: 1,
  },
});

const internalLibrary = `
(function () {
  function postMessage(message) {
    if (window.ReactNativeWebView.postMessage === undefined) {
      setTimeout(postMessage, 200, message);
    } else {
      window.ReactNativeWebView.postMessage(message);
    }
  }
  var wvw = new WebViewWorker(postMessage);
  //for android
  window.document.addEventListener('message', function (e) {
    wvw.onMainMessage(e.data);
  });
  //for ios
  window.addEventListener('message', function (e) {
    wvw.onMainMessage(e.data);
  });
}())
`;

let resolveWorker;
let workerPromise = new Promise(resolve => {
  resolveWorker = resolve;
});

function sendToWorker(message) {
  workerPromise.then(worker => worker.onWebViewMessage(message));
}

const subtle = {
  fake: true,
  decrypt(...args) {
    return workerPromise.then(worker => worker.crypto.subtle.decrypt(...args));
  },
  deriveBits(...args) {
    return workerPromise.then(worker => worker.crypto.subtle.deriveBits(...args));
  },
  deriveKey(...args) {
    return workerPromise.then(worker => worker.crypto.subtle.deriveKey(...args));
  },
  digest(...args) {
    return workerPromise.then(worker => worker.crypto.subtle.digest(...args));
  },
  encrypt(...args) {
    return workerPromise.then(worker => worker.crypto.subtle.encrypt(...args));
  },
  exportKey(...args) {
    return workerPromise.then(worker => worker.crypto.subtle.exportKey(...args));
  },
  generateKey(...args) {
    return workerPromise.then(worker => worker.crypto.subtle.generateKey(...args));
  },
  async importKey(...args) {
    return workerPromise.then(worker => worker.crypto.subtle.importKey(...args));
  },
  sign(...args) {
    return workerPromise.then(worker => worker.crypto.subtle.sign(...args));
  },
  unwrapKey(...args) {
    return workerPromise.then(worker => worker.crypto.subtle.unwrapKey(...args));
  },
  verify(...args) {
    return workerPromise.then(worker => worker.crypto.subtle.verify(...args));
  },
  wrapKey(...args) {
    return workerPromise.then(worker => worker.crypto.subtle.wrapKey(...args));
  },
};

export const PolyfillCrypto = props => {
  const webViewRef = useRef(null);

  useEffect(() => {
    const webView = webViewRef.current;

    resolveWorker(
      new MainWorker(msg => {
        webView.postMessage(msg);
      }, props.debug),
    );
  }, [props.debug]);

  const code = `((function () {${webViewWorkerString};${internalLibrary}})())`;
  const html = `<html><body><script language='javascript'>${code}</script></body></html>`;

  return (
    <View style={styles.hide}>
      <WebView
        javaScriptEnabled={true}
        onError={a => console.error(Object.keys(a), a.type, a.nativeEvent.description)}
        onMessage={ev => sendToWorker(ev.nativeEvent.data)}
        ref={webViewRef}
        originWhitelist={['*']}
        source={{ html: html, baseUrl: 'https://localhost' }}
      />
    </View>
  );
};

if (typeof global.crypto !== 'object') {
  global.crypto = {};
}

// required for webview-crypto serializer fromObject
global.crypto.fake = true;

if (typeof global.crypto.subtle !== 'object') {
  global.crypto.subtle = subtle;
}

const polyfillDigest = async (algorithm, data) => {
  const algo = algorithm.replace('-', '').toLowerCase();
  const hash = crypto.createHash(algo);
  hash.update(data);
  return hash.digest();
};

// eslint-disable-next-line no-undef
globalThis.crypto = crypto;
// eslint-disable-next-line no-undef
globalThis.crypto.subtle = {
  digest: polyfillDigest,
  ...subtle,
};

if (typeof btoa === 'undefined') {
  global.btoa = function (str) {
    return new Buffer(str, 'binary').toString('base64');
  };
}

if (typeof atob === 'undefined') {
  global.atob = function (b64Encoded) {
    return new Buffer(b64Encoded, 'base64').toString('binary');
  };
}

AppRegistry.registerComponent(appName, () => App);
