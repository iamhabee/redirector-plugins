(function() {
  chrome.webRequest.onHeadersReceived.addListener(
    function(details) {
      if (details.url.includes("api/routes/user/kyc-type")) {
        console.log(details)
        var newHeaders = details.responseHeaders.filter(function(header) {
          return header.name.toLowerCase() !== 'x-powered-by';
        });
        newHeaders.push({name: 'X-Powered-By', value: 'My Server'});
        return {responseHeaders: newHeaders};
      }
    },
    {urls: ['<all_urls>']},
    ['blocking', 'responseHeaders']
  );
})
